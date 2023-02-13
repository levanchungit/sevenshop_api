import { Schema, model, Document } from "mongoose";
import User from "models/user";
import Product from "models/product";

/*********************TYPE & INTERFACE*****************************/

export enum Status {
  CART = 1,
  DELIVERY = 2,
  SUCCESSFULLY = 3,
  CANCEL = 4,
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
  CRT_AT: Date;
  CRT_BY: string;
  MOD_AT: Date;
  MOD_BY: string;
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
  CRT_AT: { type: Date, require: true },
  CRT_BY: { type: String, require: true },
  MOD_AT: { type: Date, require: true },
  MOD_BY: { type: String, require: true },
});

const Order = model<OrderTypeModel>("Order", orderSchema);

export default Order;
