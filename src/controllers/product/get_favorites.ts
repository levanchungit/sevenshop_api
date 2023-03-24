import { Request, Response } from "express";
import Product from "models/product";
import User from "models/user";
import { isValidObjectId } from "mongoose";
import { getIdFromReq } from "utils/token";

//get favorites products list of user by user_id
const getFavoritesProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "name";
    const startIndex = (page - 1) * limit;

    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    const total = user.favorite_products.length;

    //only show field _id, name, price, images
    const products = await Product.find({
      _id: { $in: user.favorite_products },
    })
      .sort(sort)
      .limit(limit)
      .skip(startIndex)
      .select("_id name price images");

    const results = {
      total: total,
      page: page,
      limit: limit,
      results: products,
    };
    return res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500).json(err);
  }
};

export default getFavoritesProducts;
