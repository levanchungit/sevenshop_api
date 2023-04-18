import { STATUS_VOUCHER_USER, TYPE_VOUCHER } from "constants/voucher";
import { getDefaultAddress } from "controllers/user/address";
import { Request, Response } from "express";
import { IProductCart } from "interfaces/cart";
import { IInvoice } from "interfaces/invoice";
import { IVoucherUser } from "interfaces/voucher";
import Color from "models/color";
import Product, { IProduct } from "models/product";
import Size from "models/size";
import User from "models/user";
import Voucher from "models/voucher";
import moment from "moment";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const getInvoice = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);
    const user = await User.findById(user_id);
    if (!user) {
      return res.sendStatus(403);
    }
    const { products, voucher_id }: IInvoice = req.body;
    const validateFieldsResult = validateFields({ products }, [
      { name: "products", type: "arrayObject" },
    ]);
    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });
    const productsCart = products.map(async (product) => {
      const { product_id, quantity, size_id, color_id }: IProductCart = product;
      const itemProduct = await Product.findById(product_id);
      const itemSize = await Size.findById(size_id);
      const itemColor = await Color.findById(color_id);
      if (!itemProduct) {
        return { error: `Product with id ${product_id} not found` };
      }
      if (!itemSize) {
        return { error: `Size with id ${size_id} not found` };
      }
      if (!itemColor) {
        return { error: `Color with id ${color_id} not found` };
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
        size_name: itemSize.size,
        color_id,
        color_name: itemColor.name,
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
      totalAfterVoucher = 0,
      totalInvoiceDiscount;
    if (voucher_id) {
      const voucher = user.vouchers.find((item) =>
        item.voucher_id.toString() === voucher_id ? true : false
      );
      if (!voucher) {
        return res.status(400).json({ message: "Voucher not found" });
      }
      const { voucher_id: found_voucher_id, status } = voucher as IVoucherUser;
      if (status === STATUS_VOUCHER_USER.unused) {
        const voucherUser = await Voucher.findById(voucher_id);
        if (!voucherUser) {
          return res.status(400).json({ message: "Voucher not found" });
        }

        const { type, value, start_date, end_date } = voucherUser;

        //check voucher is expired
        const now = moment(getNow());
        const _start_date = moment(start_date);
        const _end_date = moment(end_date).add(1, "days");
        if (now.isBefore(_start_date) || now.isAfter(_end_date)) {
          return res.status(400).json({ message: "Voucher is expired" });
        }

        chooseVoucherID = voucherUser._id;
        if (type === TYPE_VOUCHER.percent) {
          const totalInvoiceSale = totalPrice * (value / 100);
          totalBeforeVoucher = totalPrice;
          totalAfterVoucher = totalPrice - totalInvoiceSale;
          totalInvoiceDiscount = totalInvoiceSale;
        }
        if (type === TYPE_VOUCHER.money) {
          totalBeforeVoucher = totalPrice;
          totalAfterVoucher = totalPrice - value;
          totalInvoiceDiscount = totalPrice - totalAfterVoucher;
        }
      } else if (status == STATUS_VOUCHER_USER.used) {
        return res.status(400).json({ message: "Voucher has been used" });
      }
    }
    const hasError = resolvedProducts.some((product) => !!product.error);
    if (hasError) {
      const errors = resolvedProducts.filter((product) => product.error);
      return res.status(404).json({ errors });
    }
    const address = await getDefaultAddress(user_id);
    return res.status(200).json({
      products: resolvedProducts,
      total_invoice_before_discount: voucher_id
        ? totalBeforeVoucher
        : totalBeforeDiscountProduct,
      total_invoice_discount: voucher_id
        ? totalInvoiceDiscount
        : totalDiscountProducts,
      total_invoice: voucher_id
        ? totalAfterVoucher < 0
          ? 0
          : totalAfterVoucher
        : totalPrice,
      voucher_id: chooseVoucherID,
      address,
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default getInvoice;
