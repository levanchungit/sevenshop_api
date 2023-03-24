import { Request, Response } from "express";
import Cart from "models/cart";
import { getIdFromReq } from "utils/token";

const getQuantityCart = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);

    const quantity = await Cart.find({ user_id }).countDocuments();
    res.status(200).json({ quantity });
  } catch (err) {
    res.sendStatus(500);
  }
};

export default getQuantityCart;
