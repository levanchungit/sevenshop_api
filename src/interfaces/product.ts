import { Schema } from "mongoose";
import { IModify } from "./basic";

export type IStock = {
  size_id?: string;
  color_id?: string;
  quantity: number;
};

export type IReview = {
  user_id: string;
  avatar: string;
  size_id: string;
  color_id: string;
  images: string[];
  content: string;
  rating: number;
  modify: IModify;
};

export const Stock = {
  size_id: { type: Schema.Types.ObjectId, ref: "Size" },
  color_id: { type: Schema.Types.ObjectId, ref: "Color" },
  quantity: Number,
};

export const Review = {
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  avatar: String,
  size_id: { type: Schema.Types.ObjectId, ref: "Size" },
  color_id: { type: Schema.Types.ObjectId, ref: "Color" },
  images: [String],
  content: String,
  rating: Number,
  modify: { type: Object, required: true },
};
