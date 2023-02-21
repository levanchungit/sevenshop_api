import Product from "models/product";
import Order, {
  IOrder,
  PaymentType,
  ProductType,
  Status,
} from "./../models/order";
import moment from "moment";
import { Request, Response } from "express";
import User from "models/user";
import { getIdFromReq, parseJwt, tokenGen } from "utils/token";
import { Stats } from "fs";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { code, product_id, color, size, quantity } = req.body;
    const idUser = getIdFromReq(req);
    const user = await User.findById(idUser);
    const product = await Product.findById(product_id);

    //check product exists
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }

    if (quantity > Number(product?.storage_quantity)) {
      return res.status(400).json({ message: "Not enough quantity in stock" });
    }

    // update product quantity in stock
    console.log(product_id);
    const productt = await Product.aggregate();
    if (productt) {
      return res.status(404).json({ result: productt });
    } else {
      return res.status(404).json({ message: "Properties not found" });
    }

    // const productType: ProductType = {
    //   product_id,
    //   color,
    //   size,
    //   quantity,
    //   image: "",
    // };

    // const order = await Order.findOne({
    //   user_id: idUser,
    //   order_type: Status.CART,
    // });
    // if (!order) {
    //   const newOrder = new Order({
    //     code,
    //     products: [productType],
    //     color,
    //     size,
    //     quantity,
    //     user_id: idUser,
    //     order_type: Status.CART,
    //     payment_type: PaymentType.CASH,
    //     total: Number(product?.price) * quantity,
    //     create_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
    //     create_by:
    //       user?.email +
    //       "_INS-CART_" +
    //       moment(new Date()).format("YYYY-MM-DD HH:mm"),
    //   });

    //   await newOrder.save();

    //   return res.status(201).json({ message: "Add Product Successfully" });
    // }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const idUser = getIdFromReq(req);
    const order = await Order.findOneAndUpdate(
      { user_id: idUser },
      {
        $set: {
          products: [],
          total: 0,
        },
      },
      { new: true }
    );
    if (order) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ message: "Failed To Clear Cart" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
