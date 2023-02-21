import { Schema, model, Document } from "mongoose";
import User from "models/user";

/*********************TYPE & INTERFACE*****************************/

export type AddressType = {
  id: string;
  full_name: string;
  phone: string;
  user_id: string;
  create_at: Date;
  create_by: string;
  modify_at: Date;
  modify_by: string;
};

export type AddressTypeModel = AddressType & Document;

/*******************************SCHEMA*****************************/

export const addressSchema = new Schema({
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: User },
  create_at: { type: Date, require: true },
  create_by: { type: String, require: true },
  modify_at: { type: Date, require: true },
  modify_by: { type: String, require: true },
});

const Address = model<AddressTypeModel>("Address", addressSchema);

export default Address;
