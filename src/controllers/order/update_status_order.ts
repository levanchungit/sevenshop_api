import { STATUS_ORDER } from "constants/order";
import { Request, Response } from "express";
import { IModifyOrder } from "interfaces/basic";
import Order, { IOrder } from "models/order";
import User from "models/user";
import { getNow } from "utils/common";
import { getIdFromReq } from "utils/token";

const updateStatusOrder = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    const { id } = req.params;
    const { status }: IOrder = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    if (!Object.values(STATUS_ORDER).includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const order = await Order.findById(id);
    if (!order) {
      return res.sendStatus(404);
    }
    if (order.status === STATUS_ORDER.cancelled) {
      return res.sendStatus(403);
    }
    order.status = status;
    const modify: IModifyOrder = {
      status: status,
      modified_at: getNow(),
      modified_by: user._id,
    }
    order.modify.push(modify);
    await order.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export default updateStatusOrder;
