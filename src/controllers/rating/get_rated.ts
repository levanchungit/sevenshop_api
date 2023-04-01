import { Request, Response } from "express";
import { getIdFromReq } from "utils/token";
import Rating from "models/rating";
import { IRateResult } from "interfaces/rating";
import { IReview } from "interfaces/product";

//get all ratings by user_id
const getRated = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);

    //get all rating for user_id
    const ratings = await Rating.find({ ratings: { $elemMatch: { user_id } } });
    if (!ratings) return res.status(400).json({ ratings });

    //get all ratings by user
    const rated: IRateResult[] = [];
    ratings.forEach((rating) => {
      rating.ratings.forEach((rate) => {
        if (rate.user_id.toString() == user_id.toString()) {
          rated.push({
            product_id: rating.product_id,
            ratings: rate,
          });
        }
      });
    });

    return res.status(200).json({ results: rated });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getRated;
