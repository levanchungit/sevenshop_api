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
const getRated = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);

    const ratings = await Rating.find({ ratings: { $elemMatch: { user_id } } });
    if (!ratings) return res.status(400).json({ ratings });

    //get all ratings by user
    const result = [];
    for (let i = 0; i < ratings.length; i++) {
      const rating = ratings[i];
      result.push(rating);
    }

    return res.status(200).json({ results: result });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getRated;
