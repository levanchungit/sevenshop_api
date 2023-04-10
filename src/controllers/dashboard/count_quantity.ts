import { Request, Response } from "express";
import Category from "models/category";
import Notification from "models/notification";
import Order from "models/order";
import Product from "models/product";
import User from "models/user";
import Voucher from "models/voucher";

//count quantity products, categories, users, orders, vouchers, notifications
export const countQuantity = async (req: Request, res: Response) => {
  try {
    const orders = await Order.countDocuments();
    const products = await Product.countDocuments();
    const categories = await Category.countDocuments();
    const users = await User.countDocuments();
    const notifications = await Notification.countDocuments();
    const vouchers = await Voucher.countDocuments();

    return res.status(200).json({
      orders,
      products,
      categories,
      users,
      notifications,
      vouchers,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export default countQuantity;
