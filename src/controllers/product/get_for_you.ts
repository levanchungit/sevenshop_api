import { STATUS_PRODUCT } from "constants/product";
import { Request, Response } from "express";
import Product, { IProduct } from "models/product";
import User from "models/user";
import { getIdFromReq, haveToken } from "utils/token";

const getForYou = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "name";
    const startIndex = (page - 1) * limit;

    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    let products: IProduct[] = await Product.find({
      status: STATUS_PRODUCT.active,
      $or: [
        { _id: { $in: user.recently_products } },
        { _id: { $in: user.favorite_products } },
      ],
    })
      .sort(sort)
      .limit(limit)
      .skip(startIndex)
      .select("images name price price_sale");

    if (products.length == 0) {
      products = await Product.aggregate([
        { $match: { status: STATUS_PRODUCT.active } },
        { $sample: { size: limit } },
      ]);
    }

    const results = {
      total: products.length,
      page: page,
      limit: limit,
      results: products,
    };
    return res.json(results);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getForYou;
