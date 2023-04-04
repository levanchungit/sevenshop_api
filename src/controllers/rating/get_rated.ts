import { Request, Response } from "express";
import { getIdFromReq } from "utils/token";
import Rating from "models/rating";
import User from "models/user";
import Color from "models/color";
import Size from "models/size";

//get all ratings by user_id
const getRated = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);
    //get item in ratings have user_id = user_id. Get color name, code by color_id, size name by size_id
    const ratings = await Rating.find({
      ratings: {
        $elemMatch: {
          user_id,
        },
      },
    }).populate({
      path: "ratings",
      match: { user_id },
      populate: [
        {
          path: "color_id",
          model: Color,
          select: "name code",
        },
        {
          path: "size_id",
          model: Size,
          select: "name",
        },
        {
          path: "user_id",
          model: User,
          select: "avatar full_name _id email",
        },
      ],
    });

    const arr: any = [];

    ratings.forEach((rating) => {
      rating.ratings.forEach((item) => {
        if (item.user_id._id == user_id) {
          arr.push(item);
        }
      });
    });

    return res.status(200).json({ results: arr });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getRated;
