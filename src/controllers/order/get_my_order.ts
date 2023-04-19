import { Request, Response } from "express";
import Order from "models/order";
import { isValidObjectId } from "mongoose";
import { getIdFromReq } from "utils/token";

const getMyOrderById = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.sendStatus(400);
    const order = await Order.findOne({ _id: id, user_id })
      .populate("products.product_id", "name images price")
      .populate("products.color_id", "name")
      .populate("products.size_id", "size");
    //populate address
    // .populate("address", "name phone address");

    if (!order) return res.sendStatus(404);
    return res.status(200).json(order);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getMyOrderById;
