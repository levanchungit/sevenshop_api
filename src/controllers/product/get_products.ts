import { STATUS_PRODUCT } from "constants/product";
import { Request, Response } from "express";
import Product, { IProduct } from "models/product";

const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "name";
    const startIndex = (page - 1) * limit;

    const products: IProduct[] = await Product.find({
      status: STATUS_PRODUCT.active,
    })
      .select(
        "name price price price_sale description images status category_ids color_ids size_ids"
      )
      .sort(sort)
      .limit(limit)
      .skip(startIndex);

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

export default getProducts;
