import { Request, Response } from "express";
import Cart from "models/cart";
import { getNow } from "utils/common";
import { getIdFromReq } from "utils/token";

const createCart = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      const newCart = new Cart({
        user_id,
        products: [],
        created_at: getNow(),
        created_by: "system",
      });
      await newCart.save();
      return newCart;
    }
    return cart;
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default createCart;
