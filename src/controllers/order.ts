import Product from "models/product";
import Order, { OrderType } from "./../models/order";
import moment from "moment";
import { Request, Response } from "express";
import User, { Status, UserType } from "models/user";
import bcrypt from "bcrypt";
import { getIdFromReq, parseJwt, tokenGen } from "utils/token";
import { accountVerify } from "middleware/verify";
import Log from "libraries/log";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const idUser = getIdFromReq(req);
    const user = await User.findById(idUser);
    const { code, products }: OrderType = req.body;
    // const product = await Product.findById(products.product);

    const orderUser = await Order.findOne({ user_id: idUser });
    //check order User exists
    if (orderUser) {
      console.log("IN");
      const orderUserAdd = await Order.findOneAndUpdate(
        { _id: orderUser._id },
        { $addToSet: { products: products }, $inc: { total: 1000 } }
      );
      if (orderUserAdd) {
        return res.status(200).json(orderUserAdd);
      } else {
        return res.status(500).json({ message: "Failed To Add Product" });
      }
    } else {
      console.log("IN2");

      const order = new Order({
        code,
        user_id: idUser,
        products,
        create_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        create_by:
          user?.email + "_INS_" + moment(new Date()).format("YYYY-MM-DD HH:mm"),
      });
      const savedOrder = await order.save();
      if (savedOrder) {
        return res.status(200).json(savedOrder);
      } else {
        return res.status(500).json({ message: "Fail create new order" });
      }
    }
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
