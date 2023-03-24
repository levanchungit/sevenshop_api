import Order, { IOrder } from "models/order";
import { Request, Response } from "express";
import { getIdFromReq } from "utils/token";

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const sort = (req.query.sort as string) || "created_at";

    const order: IOrder[] = await Order.find({ user_id })
      .sort(sort)
      .limit(limit)
      .skip(startIndex)
      .populate("products.product_id", "name images");

    const total = await Order.countDocuments({ user_id });

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

export default getMyOrders;
