import { PAYMENT_TYPE, STATUS_ORDER } from "constants/order";
import { IModifyOrder, ModifyOrder } from "interfaces/basic";
import { AddressOrder, IProductOrder, ProductOrder } from "interfaces/order";
import { IAddress } from "interfaces/user";
import { Document, model, Schema } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export type IOrder = {
  user_id: string;
  products: IProductOrder;
  total_price: number;
  total_discount: number;
  total_before_discount: number;
  note: string;
  address: Omit<IAddress, "_id" | "default_address">;
  payment_type: PAYMENT_TYPE;
  status: STATUS_ORDER;
  voucher_id: string;
  created_by: string;
  modify: IModifyOrder[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type OrderTypeModel = IOrder & Document;

/*******************************SCHEMA*****************************/

const orderSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [ProductOrder], required: true },
    total_price: { type: Number, required: true },
    total_discount: { type: Number, required: true },
    total_before_discount: { type: Number, required: true },
    payment_type: { type: String, required: true },
    status: { type: String, enum: STATUS_ORDER, default: STATUS_ORDER.pending },
    address: { type: AddressOrder, required: true },
    voucher_id: { type: String },
    created_by: { type: String, require: true },
    modify: { type: [ModifyOrder], require: true },
  },
  { timestamps: true }
);

const Order = model<OrderTypeModel>("Order", orderSchema);
export default Order;
