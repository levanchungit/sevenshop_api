import { getNow, isValidDate } from "utils/common";
import { Request, Response } from "express";
import Product from "models/product";
import Rating from "models/rating";
import { getIdFromReq } from "utils/token";
import User from "models/user";

//create a rating table rating
const createRating = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const { product_id, color_id, size_id, images, content, rating } = req.body;

    const ratings = await Rating.findOne({
      product_id,
    });

    //check rating 1 -> 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1 -> 5" });
    }

    //check ratings is exist or not if not create new one
    if (!ratings) {
      const newRating = new Rating({
        product_id,
        ratings: [
          {
            user_id: user._id,
            avatar: user.avatar,
            size_id,
            color_id,
            images,
            content,
            rating,
            modify: { action: `Create by ${user.email}`, date: getNow() },
          },
        ],
        average_rating: rating,
      });

      await newRating.save();
      return res.sendStatus(200);
    }
    // else {
    //   const isRated = ratings.ratings.find((rating) => {
    //     return rating.user_id.toString() === user._id.toString();
    //   });

    //   if (isRated) {
    //     return res.status(400).json({ message: "You have rated this product" });
    //   }
    // }

    ratings.ratings.push({
      user_id: user._id,
      size_id,
      color_id,
      images,
      content,
      rating,
      modify: { action: `Create by ${user.email}`, date: getNow() },
    });

    //calculate average rating
    let totalRating = 0;
    ratings.ratings.forEach((rating) => {
      totalRating += rating.rating;
    });

    ratings.average_rating = totalRating / ratings.ratings.length;

    await ratings.save();

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export default createRating;
