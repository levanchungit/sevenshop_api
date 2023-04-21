import { STATUS_PRODUCT } from "constants/product";
import { Request, Response } from "express";
import Product, { IProduct } from "models/product";

const getProductByCategories = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "name";
    const startIndex = (page - 1) * limit;

    const { category } = req.query;

    //get products by category_ids = category. populate name, price, price_sale, images[0]

    const products = await Product.find({
      category_ids: category,
      status: STATUS_PRODUCT.active,
    })
      .select({
        name: 1,
        price: 1,
        price_sale: 1,
        images: 1,
      })
      .sort(sort)
      .limit(limit)
      .skip(startIndex)
      .exec();

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

export default getProductByCategories;
