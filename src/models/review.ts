import { Schema, model, Document } from "mongoose";
import User from "models/user";
import Product from "models/product";

/*********************TYPE & INTERFACE*****************************/

export type ReviewType = {
  id: string;
  content: string;
  rating: number;
  user_id: string;
  product_id: string;
  CRT_AT: Date;
  CRT_BY: string;
  MOD_AT: Date;
  MOD_BY: string;
};

export type ReviewTypeModel = {} & ReviewType & Document;

/*******************************SCHEMA*****************************/

const reviewSchema = new Schema({
  content: { type: String, require: true },
  rating: { type: Number, require: true },
  user_id: { type: Schema.Types.ObjectId, ref: User },
  product_id: { type: Schema.Types.ObjectId, ref: Product },
  CRT_AT: { type: Date, require: true },
  CRT_BY: { type: String, require: true },
  MOD_AT: { type: Date, require: true },
  MOD_BY: { type: String, require: true },
});

const Review = model<ReviewTypeModel>("Review", reviewSchema);

export default Review;
