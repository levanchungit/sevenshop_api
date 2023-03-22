import Order from "models/order";
import { Request, Response } from "express";

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findOneAndDelete({ _id: id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export default deleteOrder;
