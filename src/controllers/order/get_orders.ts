import Order, { IOrder } from "models/order";
import { Request, Response } from "express";

const getOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    //sort newsest or oldest
    const sort = "-created_at";
    const total = await Order.countDocuments();

    const order: IOrder[] = await Order.find()
      .sort(sort)
      .limit(limit)
      .skip(startIndex);

    const results = {
      total: total,
      page: page,
      limit: limit,
      results: order,
    };

    return res.json(results);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getOrders;
