import { TIME_END_FLASH_SALE } from "constants/basic";
import { STATUS_PRODUCT } from "constants/product";
import { Request, Response } from "express";
import Product, { IProduct } from "models/product";
import moment from "moment";

const getFlashSale = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "name";
    const startIndex = (page - 1) * limit;

    //get products flash sale by price_sale have and price_sale > 0
    let products: IProduct[] = await Product.find({
      status: STATUS_PRODUCT.active,
      price_sale: { $gt: 0 },
    })
      .sort(sort)
      .limit(limit)
      .skip(startIndex)
      .select("images name price price_sale");

    if (moment().isAfter(TIME_END_FLASH_SALE)) {
      return res.status(400).json({ message: "Flash sale is the end" });
    }

    const results = {
      total: products.length,
      page: page,
      limit: limit,
      time_end_flash_sale: TIME_END_FLASH_SALE,
      results: products,
    };
    return res.json(results);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getFlashSale;
