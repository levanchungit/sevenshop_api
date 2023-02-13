import { Schema, model, Document } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export type PropertiesType = {
  color: number;
  size: number;
};

export type ProductType = {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  active: boolean;
  properties_type: PropertiesType[];
  categories_type: Number;
  CRT_AT: Date;
  CRT_BY: string;
  MOD_AT: Date;
  MOD_BY: string;
};

export type ProductTypeModel = {} & ProductType & Document;

/*******************************SCHEMA*****************************/

export const Properties = {
  color: Number,
  size: Number,
};

const productSchema = new Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  description: { type: String, require: true },
  images: [{ type: String, default: [] }],
  active: { type: Boolean, default: true },
  properties_type: [{ type: Properties, default: [] }],
  categories_type: { type: Number },
  CRT_AT: { type: Date, require: true },
  CRT_BY: { type: String, require: true },
  MOD_AT: { type: Date, require: true },
  MOD_BY: { type: String, require: true },
});

const Product = model<ProductTypeModel>("Product", productSchema);

export default Product;
