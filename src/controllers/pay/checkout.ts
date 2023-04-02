import { PAYMENT_TYPE, STATUS_ORDER } from "constants/order";
import { Request, Response } from "express";
import { IInvoice } from "interfaces/invoice";
import Cart from "models/cart";
import Order from "models/order";
import Product from "models/product";
import User from "models/user";
import { getNow } from "utils/common";
import { getIdFromReq } from "utils/token";

const checkout = async (req: Request, res: Response) => {
  try {
    const id_user = getIdFromReq(req);
    const user = await User.findById(id_user);
    if (!user) {
      return res.sendStatus(403);
    }
    const {
      products,
      total_invoice,
      total_invoice_before_discount,
      total_invoice_discount,
      payment_type,
      address,
      note,
      voucher_id,
    }: IInvoice = req.body;

    //check address exists in user
    if (user.addresses) {
    }
    const addressExists = user.addresses.filter(
      (addressItem) => addressItem._id?.toString() == address?._id?.toString()
    );
    if (addressExists.length == 0) {
      return res.status(400).json({ message: "Address is not exists" });
    }

    if (payment_type === PAYMENT_TYPE.cod) {
      const newOrder = new Order({
        user_id: id_user,
        products,
        total_price: total_invoice,
        total_discount: total_invoice_discount,
        total_before_discount: total_invoice_before_discount,
        payment_type,
        address,
        note,
        voucher_id,
        status: STATUS_ORDER.pending,
        created_at: getNow(),
        created_by: user.email,
        modify: [
          {
            status: STATUS_ORDER.pending,
            modify_at: getNow(),
            modify_by: `${user.email} send order`,
          },
        ],
      });
      await newOrder.save();

      //remove product in cart
      const cart = await Cart.findOne({ user_id: id_user });
      if (cart) {
        const newProducts = cart.products.filter((product) => {
          return !products.find(
            (productItem) =>
              productItem.product_id.toString() ==
                product.product_id.toString() &&
              productItem.color_id.toString() == product.color_id.toString() &&
              productItem.size_id.toString() == product.size_id.toString()
          );
        });
        cart.products = newProducts;
        await cart.save();
      }

      //remove quantity in product.stock
      try {
        const productsInStock = products.map(async (product) => {
          const { product_id, quantity, size_id, color_id } = product;
          console.log(product);

          const productInStock = await Product.findById(product_id);
          if (!productInStock) return res.sendStatus(404);
          const { stock } = productInStock;
          const newStock = stock.map((stockItem) => {
            if (stockItem.size_id == null || stockItem.color_id == null)
              return stockItem;

            if (
              stockItem.size_id.toString() == size_id.toString() &&
              stockItem.color_id.toString() == color_id.toString()
            ) {
              //check stock.quantity > quantity
              console.log(stockItem.quantity, quantity);
              if (stockItem.quantity < quantity) {
                throw new Error(
                  `Product ${product_id} size: ${size_id} color: ${color_id} is out of stock`
                );
              }

              return {
                ...stockItem,
                quantity: stockItem.quantity - quantity,
              };
            }

            return stockItem;
          });

          productInStock.stock = newStock;
          await productInStock.save();
        });
        await Promise.all(productsInStock);
      } catch (err: any) {
        return res.status(400).json({ message: err.message });
      }

      //send email to user

      //send email to admin

      return res.sendStatus(201);
    }
    return res.sendStatus(501);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default checkout;
