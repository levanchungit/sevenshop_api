import { Schema, model, Document } from "mongoose";
import Product from "models/product";

/*********************TYPE & INTERFACE*****************************/

export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  other = "OTHER",
}

export type AddressType = {
  full_name: string;
  phone: string;
  address: string;
};

export type UserType = {
  username: String;
  password: String;
  fullname: String;
  phone: String;
  image: String;
  gender: Gender;
  birthday: { type: String; require: true };
  address: AddressType;
  status: { type: Boolean; default: true };
  role: { type: String; enum: ["USER", "ADMIN"]; default: "USER" };
  productFavorites: [];
  currentProduct: [];
};

export type UserTypeModel = UserType & Document;

/*******************************SCHEMA*****************************/
export const Address = {
  full_name: String,
  phone: String,
  address: String,
};

export const userSchema = new Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  fullname: { type: String, require: true },
  phone: { type: String, require: true },
  image: { type: String, require: true },
  gender: { type: String, require: true },
  birthday: { type: String, require: true },
  address: [Address],
  status: { type: Boolean, default: true },
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  productFavorites: [Product],
  currentProduct: [Product],
});

export default model<UserTypeModel>("User", userSchema);
