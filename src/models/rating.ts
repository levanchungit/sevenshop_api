import { IReview, Review } from "interfaces/product";
import { Document, model, Schema } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export type IRating = {
  product_id: string;
  ratings: IReview[];
};

export type RatingTypeModel = IRating & Document;

/*******************************SCHEMA*****************************/

const ratingSchema: Schema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  ratings: { type: [Review], require: true },
});

const Rating = model<RatingTypeModel>("Rating", ratingSchema);
export default Rating;
