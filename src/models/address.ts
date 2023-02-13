import { Schema, model, Document } from "mongoose";
import User from "models/user";

/*********************TYPE & INTERFACE*****************************/

export type AddressType = {
  id: string;
  full_name: string;
  phone: string;
  user_id: string;
  CRT_AT: Date;
  CRT_BY: string;
  MOD_AT: Date;
  MOD_BY: string;
};

export type AddressTypeModel = AddressType & Document;

/*******************************SCHEMA*****************************/

export const addressSchema = new Schema({
  full_name: { type: String, required: true },
  phone: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: User },
  CRT_AT: { type: Date, require: true },
  CRT_BY: { type: String, require: true },
  MOD_AT: { type: Date, require: true },
  MOD_BY: { type: String, require: true },
});

const Address = model<AddressTypeModel>("Address", addressSchema);

export default Address;
