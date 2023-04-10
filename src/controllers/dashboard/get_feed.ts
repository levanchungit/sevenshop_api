import { Request, Response } from "express";
import Cart from "models/cart";
import Category from "models/category";
import Notification from "models/notification";
import Order from "models/order";
import Product from "models/product";
import User from "models/user";
import Voucher from "models/voucher";

//get modify all table
export const getModifyAllTable = async (req: Request, res: Response) => {
  try {
    //get only field modify in all users
    const users = await User.find({}, "modify");
    res.status(200).json(users);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export default getModifyAllTable;
