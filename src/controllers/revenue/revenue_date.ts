import { IOrder } from "./../../models/order";
import { formatDateTime } from "./../../utils/common";
import { STATUS_ORDER } from "constants/order";
import { Request, Response } from "express";
import Order from "models/order";

const chartOrder = async (req: Request, res: Response) => {
  const { status } = req.query;
  if (!status) return res.status(400).json({ message: "Status is required" });
  const orders = await Order.find({
    status,
  });
  const total = orders.reduce((acc: any, order: IOrder) => {
    return acc + order.total_price;
  }, 0);
  //get quantity order
  const quantity = orders.length;

  //get date, total by orders, if date is same, total += total return array { date, total}
  const results = orders.reduce((acc: any, order: IOrder) => {
    const date = formatDateTime(order.created_at);
    const index = acc.findIndex((item: any) => item.date === date);
    if (index !== -1) {
      acc[index].total += order.total_price;
    } else {
      acc.push({ date, total: order.total_price });
    }
    return acc;
  }, []);
  return res.json({
    total,
    quantity,
    results,
  });
};
export default chartOrder;
