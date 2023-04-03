import { Request, Response } from "express";
import Product from "models/product";
import User from "models/user";
import { isValidObjectId } from "mongoose";
import { getNow } from "utils/common";
import { getIdFromReq } from "utils/token";

//add product to recentProducts in user
const recentlyProduct = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product_id" });
    }

    //check product exist not push
    if (user.recently_products.includes(id)) {
      return res.sendStatus(200);
    }
    user.recently_products.push(id);
    user.modify.push({
      action: `Add product '${id}' to recently list by ${user?.email}`,
      date: getNow(),
    });

    await user.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default recentlyProduct;
