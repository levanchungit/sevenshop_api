import { STATUS_ORDER } from "../../constants/order";
import { Request, Response } from "express";
import Order from "models/order";
import Product, { IProduct } from "models/product";
import { getIdFromReq } from "utils/token";
import { IRatingResult } from "interfaces/rating";
import Size from "models/size";
import Color from "models/color";
import Rating from "models/rating";

//get all ratings by user_id
const getRatings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    const { id } = req.params;

    const rating = await Rating.findOne({ product_id: id })
      .limit(limit)
      .skip(startIndex);
    if (!rating) return res.status(400).json({ rating });
    const total = rating.ratings.length;
    return res
      .status(200)
      .json({ total: total, page: page, limit: limit, results: rating });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getRatings;
