import { Schema, model, Document } from "mongoose";
import User from "models/user";
import Product from "models/product";

/*********************TYPE & INTERFACE*****************************/

export enum Status {
  cart = 1,
  delivery = 2,
  successfully = 3,
  cancel = 4,
}
export type OrderType = {
  id: string;
  code: string;
  total: number;
  user_id: string;
  products: [];
  order_type: Status;
  payment_type: number;
  voucher_type: [];
  create_at: Date;
  create_by: string;
  modify_at: Date;
  modify_by: string;
};

export type OrderTypeModel = {} & OrderType & Document;

/*******************************SCHEMA*****************************/

export const Products = {
  id: { type: Schema.Types.ObjectId, ref: Product },
  quantity: Number,
};

const orderSchema = new Schema({
  code: { type: String, require: true },
  total: { type: Number, require: true },
  user_id: { type: Schema.Types.ObjectId, ref: User },
  products: [{ type: Products, default: [] }],
  order_type: { type: String, enum: Status },
  payment_type: { type: String },
  voucher_type: { type: String },
  create_at: { type: Date, require: true },
  create_by: { type: String, require: true },
  modify_at: { type: Date, require: true },
  modify_by: { type: String, require: true },
});

const Order = model<OrderTypeModel>("Order", orderSchema);

export default Order;