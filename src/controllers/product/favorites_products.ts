import { Request, Response } from "express";
import Product from "models/product";
import User from "models/user";
import { isValidObjectId } from "mongoose";
import { getNow } from "utils/common";
import { getIdFromReq } from "utils/token";

const productFavorites = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product_id" });
    }

    const product = await Product.findById(id);
    if (!product) return res.sendStatus(404);

    if (user.favorite_products.includes(id)) {
      user.favorite_products = user.favorite_products.filter(
        (item) => item != id
      );
      user.modify.push({
        action: `Delete product '${id}' from favorites list by ${user?.email}`,
        date: getNow(),
      });
    } else {
      user.favorite_products.push(id);
      user.modify.push({
        action: `Add product '${id}' to favorites list by ${user?.email}`,
        date: getNow(),
      });
    }
    await user.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default productFavorites;
