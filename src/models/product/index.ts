import { Schema, model, Document } from "mongoose";

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
  user_id: string;
  username: string;
};

export type ProductType = {
  name: string;
  price: number;
  description: string;
  colors: string[];
  sizes: string[];
  banner: string;
  images: string[];
  categories: string[];
  reviews: ReviewType[];
};

export type ProductTypeModel = {} & ProductType & Document;
/*******************************SCHEMA*****************************/
export const Review = {
  content: String,
  rating: Number,
  created_at: String,
  user_id: String,
  username: String,
};

const productSchema = new Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  description: { type: String, require: true },
  colors: { type: [String], default: [] },
  sizes: { type: [String], default: [] },
  banner: { type: String, default: "" },
  images: { type: [String], default: [] },
  categories: { type: [String], default: [] },
  reviews: { type: [Review], default: [] },
});

const Product = model<ProductTypeModel>("Product", productSchema);

export default Product;
