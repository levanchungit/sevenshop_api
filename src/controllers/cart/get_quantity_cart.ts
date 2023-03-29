import { Request, Response } from "express";
import Cart from "models/cart";
import { getIdFromReq } from "utils/token";

const getQuantityCart = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);
    const products = await Cart.findOne({ user_id }).select("products");
    const quantity = products?.products.length;
    res.status(200).json({ quantity });
  } catch (err) {
    res.sendStatus(500);
  }
};

export default getQuantityCart;
