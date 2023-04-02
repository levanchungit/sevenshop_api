import { Request, Response } from "express";
import Product, { IProduct } from "models/product";

const searchProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "name";
    const startIndex = (page - 1) * limit;

    const { keyword } = req.query;
    const regex = new RegExp(keyword as string, "i");
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }],
    })
      .sort(sort)
      .limit(limit)
      .skip(startIndex);

    const results = {
      total: products.length,
      page: page,
      limit: limit,
      results: products,
    };
    return res.status(200).json(results);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default searchProducts;
