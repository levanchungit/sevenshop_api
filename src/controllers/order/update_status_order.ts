import Order, { IOrder } from "models/order";
import { Request, Response } from "express";
import { getIdFromReq } from "utils/token";
import { getNow } from "utils/common";
import User from "models/user";

//update status order, note modify
const updateStatusOrder = async (req: Request, res: Response) => {
  try {
    const id_user = getIdFromReq(req);
    const user = await User.findById(id_user);
    if (!user) return res.sendStatus(403);

    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findOne({ _id: id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const fieldsEdited: any[] = [];

    if (status && status !== order.status) fieldsEdited.push("status");

    if (!fieldsEdited.length) return res.sendStatus(304);

    const modify = {
      status: status,
      modify_at: getNow(),
      modify_by: `${user.email} send order`,
    };
    order.modify.push(modify);
    order.status = status;
    await order.save();
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

export default updateStatusOrder;
