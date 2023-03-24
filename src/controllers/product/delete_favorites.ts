import { Request, Response } from "express";
import Product from "models/product";
import User from "models/user";
import { isValidObjectId } from "mongoose";
import { getIdFromReq } from "utils/token";

//delete favorite product of user by user_id and product_id
const deleteFavorites = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.sendStatus(400);
    const product = await Product.findOne({ _id: id });
    if (!product) return res.sendStatus(404);
    user.favorite_products = user.favorite_products.filter(
      (item) => item.toString() !== id
    );
    await user.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500).json(err);
  }
};

export default deleteFavorites;
