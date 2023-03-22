import { Schema } from "mongoose";

export type IStock = {
  size_id?: string;
  color_id?: string;
  quantity: number;
};

export type IReview = {
  user_id: string;
  images: string[];
  content: string;
  rating: number;
};

export const Stock = {
  size_id: { type: Schema.Types.ObjectId, ref: "Size" },
  color_id: { type: Schema.Types.ObjectId, ref: "Color" },
  quantity: Number,
};

export const Review = {
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  images: [String],
  content: String,
  rating: Number,
};
