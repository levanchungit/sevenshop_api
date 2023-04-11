import { IModify } from "./../../interfaces/basic";
import { Request, Response } from "express";
import Cart from "models/cart";
import Category from "models/category";
import Notification from "models/notification";
import Order from "models/order";
import Product from "models/product";
import Rating from "models/rating";
import User, { IUser } from "models/user";
import Voucher from "models/voucher";
import { Document, Types } from "mongoose";

//get modify all table
export const getModifyAllTable = async (req: Request, res: Response) => {
  try {
    //get created_at created_by from orders
    const orders = await Order.find().select("created_at created_by");

    const modify = {
      orders: [] as { created_at: Date; created_by: string }[],
    };

    orders.map((order) =>
      modify.orders.push({
        created_at: order.created_at,
        created_by: order.created_by,
      })
    );

    modify.orders = modify.orders.slice(0, 10);

    res.status(200).json(modify);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export default getModifyAllTable;
