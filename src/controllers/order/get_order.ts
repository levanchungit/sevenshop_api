import { Request, Response } from "express";
import Order from "models/order";

const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.sendStatus(404);
    return res.status(200).json(order);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getOrderById;
