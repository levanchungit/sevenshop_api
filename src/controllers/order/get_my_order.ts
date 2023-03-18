import { Request, Response } from "express";
import Order from "models/order";
import { getIdFromReq } from "utils/token";

const getMyOrderById = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user_id });
    if (!order) return res.sendStatus(404);
    return res.status(200).json(order);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getMyOrderById;
