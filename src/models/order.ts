import { IProductCart } from "interfaces/cart";
import { PAYMENT_TYPE, STATUS_ORDER } from "constants/order";
import { IModifyOrder, ModifyOrder } from "interfaces/basic";
import { IProductOrder, ProductOrder } from "interfaces/order";
import { Document, model, Schema } from "mongoose";
import { Address, IAddress } from "interfaces/user";

/*********************TYPE & INTERFACE*****************************/

export type IOrder = {
  user_id: string;
  products: IProductCart[];
  address: IAddress;
  total_price: number;
  total_discount: number;
  total_before_discount: number;
  note: string;
  payment_type: PAYMENT_TYPE;
  status: STATUS_ORDER;
  voucher_ids: string[];
  created_at: Date;
  created_by: string;
  modify: IModifyOrder[];
};

export type OrderTypeModel = IOrder & Document;

/*******************************SCHEMA*****************************/

const orderSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: { type: [ProductOrder], required: true },
  address: { type: Address, required: true },
  total_price: { type: Number, required: true },
  total_discount: { type: Number, required: true },
  total_before_discount: { type: Number, required: true },
  payment_type: { type: String, required: true },
  status: { type: String, enum: STATUS_ORDER, default: STATUS_ORDER.pending },
  voucher_id: { type: String },
  created_at: { type: Date, require: true },
  created_by: { type: String, require: true },
  modify: { type: [ModifyOrder], require: true },
});

const Order = model<OrderTypeModel>("Order", orderSchema);
export default Order;
