import { STATUS_VOUCHER_USER, TYPE_VOUCHER } from "constants/voucher";
import { Request, Response } from "express";
import { IProductCart } from "interfaces/cart";
import { IInvoice } from "interfaces/invoice";
import { IVoucherUser } from "interfaces/voucher";
import Product, { IProduct } from "models/product";
import User from "models/user";
import Voucher from "models/voucher";
import { getIdFromReq } from "utils/token";

const getInvoice = async (req: Request, res: Response) => {
  try {
    const id_user = getIdFromReq(req);
    const user = await User.findById(id_user);
    if (!user) {
      return res.sendStatus(403);
    }
    const { products, address: address_body, voucher_id }: IInvoice = req.body;
    const productsCart = products.map(async (product) => {
      const { product_id, quantity, size_id, color_id }: IProductCart = product;
      const itemProduct = await Product.findById(product_id);
      if (!itemProduct) {
        return { error: `Product with id ${product_id} not found` };
      }
      const { name, price, price_sale, images, stock }: IProduct = itemProduct;
      if (stock) {
        const stockProduct = stock.find(
          (item) => item.size_id === size_id && item.color_id === color_id
        );
        if (stockProduct) {
          if (stockProduct.quantity < quantity) {
            return {
              error: `The requested quantity of product with id ${product_id} is greater than available stock`,
            };
          }
        }
      }
      const totalBeforeDiscount = quantity * price;
      const totalDiscount = quantity * price_sale;
      const total = quantity * (price_sale || price);
      return {
        product_id,
        quantity,
        size_id,
        color_id,
        name,
        price,
        price_sale,
        images,
        total_before_discount: totalBeforeDiscount,
        total_discount: totalDiscount,
        total,
      };
    });
    const resolvedProducts = await Promise.all(productsCart);
    const validProducts = resolvedProducts.filter((product) => !product.error);
    const totalBeforeDiscountProduct = validProducts.reduce(
      (total, item) =>
        item.total_before_discount ? total + item.total_before_discount : total,
      0
    );
    const totalDiscountProducts = validProducts.reduce(
      (total, item) =>
        item.total_discount ? total + item.total_discount : total,
      0
    );
    const totalPrice = validProducts.reduce(
      (total, item) => (item.total ? total + item.total : total),
      0
    );
    let chooseVoucherID,
      totalBeforeVoucher,
      totalAfterVoucher,
      totalInvoiceDiscount;
    if (voucher_id) {
      const voucher = user.vouchers.find(
        (item) => item.voucher_id === voucher_id
      );
      if (!voucher) {
        return res.status(400).json({ message: "Voucher not found" });
      }
      const { voucher_id, status } = voucher as IVoucherUser;
      if (status === STATUS_VOUCHER_USER.unused) {
        const voucherUser = await Voucher.findById(voucher_id);
        if (!voucherUser) {
          return res.status(400).json({ message: "Voucher not found" });
        }
        const { type, value } = voucherUser;
        chooseVoucherID = voucherUser._id;
        if (type === TYPE_VOUCHER.percent) {
          const totalInvoiceSale = totalPrice * (value / 100);
          totalBeforeVoucher = totalPrice;
          totalAfterVoucher = totalPrice - totalInvoiceSale;
        }
        if (type === TYPE_VOUCHER.money) {
          totalBeforeVoucher = totalPrice;
          totalAfterVoucher = totalPrice - value;
        }
      }
      return res.status(400).json({ message: "Voucher expired" });
    }
    const hasError = resolvedProducts.some((product) => !!product.error);
    if (hasError) {
      const errors = resolvedProducts.filter((product) => product.error);
      return res.status(404).json({ errors });
    }
    if (!user.addresses) {
      return res.status(400).json({ message: "Please add address" });
    }
    const address = user.addresses.find((item) => item.default_address);
    if (!address) {
      return res.status(400).json({ message: "Please choose address" });
    }
    const { full_name, phone, address: addressUser } = address;
    return res.status(200).json({
      products: resolvedProducts,
      total_invoice_before_discount: voucher_id
        ? totalBeforeVoucher
        : totalBeforeDiscountProduct,
      total_invoice_discount: voucher_id
        ? totalInvoiceDiscount
        : totalDiscountProducts,
      total_invoice: voucher_id ? totalAfterVoucher : totalPrice,
      voucher_id: chooseVoucherID,
      address: address_body || { full_name, phone, address: addressUser },
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default getInvoice;