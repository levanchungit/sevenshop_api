import { Request, Response } from "express";
import Product, { IProduct } from "models/product";

const filterProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    let sort = (req.query.sort as string) || "name";

    if (sort === "price") {
      sort = "price_sale";
    }

    if (req.query.sort_type === "desc") {
      sort = "-" + sort;
    }

    const startIndex = (page - 1) * limit;

    const { categories, sizes, colors, price_min, price_max } = req.query;

    //check not have quey params return all products
    if (!categories && !sizes && !colors && !price_min && !price_max) {
      const total = await Product.countDocuments();
      const products: IProduct[] = await Product.find({})
        .sort(sort)
        .limit(limit)
        .skip(startIndex)
        .select("name price price_sale images");

      const results = {
        total: total,
        page: page,
        limit: limit,
        results: products,
      };
      return res.json(results);
    }

    const query: any = {};

    if (categories) {
      query.category_ids = { $in: categories };
    }

    if (sizes) {
      query.size_ids = { $in: sizes };
    }

    if (colors) {
      query.color_ids = { $in: colors };
    }

    if (price_min && price_max) {
      query.price = { $gte: price_min, $lte: price_max };
    } else if (price_min) {
      query.price = { $gte: price_min };
    } else if (price_max) {
      query.price = { $lte: price_max };
    }

    //filter product by categories and sizes and colors and price range
    const products: IProduct[] = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(startIndex)
      .select("name price price_sale images");

    const total = await Product.countDocuments(query);

    const results = {
      total: total,
      page: page,
      limit: limit,
      results: products,
    };

    return res.status(200).json(results);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default filterProducts;
