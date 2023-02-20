import { Schema, model, Document } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export type Properties = {
  color: number;
  size: number;
  quantity: number;
};

export type PropertiesType = {
  total: number;
  properties: Properties[];
};

export type ProductType = {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  active: boolean;
  properties_type: PropertiesType;
  categories_type: Number;
  create_at: string;
  create_by: string;
  modify_at: string;
  modify_by: string;
};

export type ProductTypeModel = {} & ProductType & Document;

/*******************************SCHEMA*****************************/

export const Properties = {
  color: Number,
  size: Number,
  quantity: Number,
};

export const PropertiesType = {
  total: Number,
  properties: [Properties],
};

const productSchema = new Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  description: { type: String, require: true },
  images: [{ type: String, default: [] }],
  active: { type: Boolean, default: true },
  properties_type: [{ type: Properties, default: [] }],
  categories_type: { type: Number },
  create_at: { type: String, require: true },
  create_by: { type: String, require: true },
  modify_at: { type: String, require: true },
  modify_by: { type: String, require: true },
});

const Product = model<ProductTypeModel>("Product", productSchema);

export default Product;
