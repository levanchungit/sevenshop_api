import { Gender } from "./../user/index";
import { Schema, model, Document } from "mongoose";
import { type } from "os";

/*********************TYPE & INTERFACE*****************************/
export enum ProductSort {
  price_asc = "PRICE_ASC",
  price_des = "PRICE_DES",
  name_asc = "NAME_ASC",
  name_des = "NAME_DES",
}

export type ReviewType = {
  content: string;
  rating: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  username: string;
};

export type ProductType = {
  name: string;
  price: number;
  description: string;
  colors: string[];
  size: string[];
  image: string;
  category: string;
  review: ReviewType;
};

export type ProductTypeModel = {} & ProductType & Document;
/*******************************SCHEMA*****************************/
export const Review = {
  content: String,
  rating: Number,
  created_at: String,
  updated_at: String,
  user_id: String,
  username: String,
};

const productSchema = new Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  description: { type: String, require: true },
  colors: { type: String, default: [] },
  size: { type: String, default: [] },
  image: { type: String, require: true },
  category: { type: String, require: true },
  review: [Review],
});

export default model<ProductTypeModel>("Product", productSchema);
