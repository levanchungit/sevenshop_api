import { IOrder } from "models/order";
import { formatDateTime, isValidDate } from "utils/common";
import { STATUS_ORDER } from "constants/order";
import { Request, Response } from "express";
import Order from "models/order";
import moment from "moment";

const revenueDay = async (req: Request, res: Response) => {
  try {
    const { status, start_date, end_date } = req.query;
    if (!status) return res.status(400).json({ message: "Status is required" });
    if (!Object.values(STATUS_ORDER).includes(status as STATUS_ORDER))
      return res.status(400).json({ message: "Status is invalid" });

    if (!start_date || !end_date)
      return res
        .status(400)
        .json({ message: "Start date, end date is required" });

    if (
      !isValidDate(start_date as string) ||
      !isValidDate(start_date as string)
    )
      return res
        .status(400)
        .json({ message: "Start date, end date is invalid (YYYY-MM-DD)" });

    const startDate = start_date.toString();
    const endDate = end_date.toString();

    const orders = await Order.find({
      status,
      created_at: {
        $gte: startDate,
        $lte: moment(endDate).add(1, "days"),
      },
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default revenueDay;
