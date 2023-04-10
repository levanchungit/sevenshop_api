import { Request, Response } from "express";
import Cart from "models/cart";
import Category from "models/category";
import Notification from "models/notification";
import Order from "models/order";
import Product from "models/product";
import User, { IUser } from "models/user";
import Voucher from "models/voucher";
import { Document, Types } from "mongoose";

//get modify all table
export const getModifyAllTable = async (req: Request, res: Response) => {
  try {
    //get all table in database only field modify
    //modify.date is string value. I want to sort by date
    const carts = await Cart.find({}, "modify").sort({ "modify.date": 1 });

    const notifications = await Notification.find({}, "modify").sort({
      "modify.date": 1,
    });
    const orders = await Order.find({}, "modify").sort({ "modify.date": 1 });

    const modify = [] as any[];

    carts.map((carts) => {
      if (carts.modify.length > 0) {
        carts.modify.map((item) => {
          modify.push(item);
        });
      }
    });

    notifications.map((notifications) => {
      if (notifications.modify.length > 0) {
        notifications.modify.map((item) => {
          modify.push(item);
        });
      }
    });

    orders.map((orders) => {
      if (orders.modify.length > 0) {
        orders.modify.map((item) => {
          modify.push(item);
        });
      }
    });

    res.status(200).json(modify);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export default getModifyAllTable;
