import { Schema } from "mongoose";
import { IModify } from "./basic";

export type IStock = {
  size_id?: string;
  color_id?: string;
  quantity: number;
};

export type IStockResult = {
  size_id: string;
  size_name: string;
  color_id: string;
  color_name: string;
  quantity: number;
};

export type IReview = {
  user_id: {
    _id: string;
    full_name?: string;
    avatar?: string;
    email?: string;
  };
  size_id: {
    _id: string;
    size?: string;
  };
  color_id: {
    _id: string;
    name?: string;
    code?: string;
  };
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
  size_id: { type: Schema.Types.ObjectId, ref: "Size" },
  color_id: { type: Schema.Types.ObjectId, ref: "Color" },
  images: [String],
  content: String,
  rating: Number,
  modify: { type: Object, required: true },
};
