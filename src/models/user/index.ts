import { Schema, model, Document } from "mongoose";
import Product from "../product";

/*********************TYPE & INTERFACE*****************************/

export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
  other = "OTHER",
}

export enum Language {
  VietNam = "VIETNAM",
  English = "ENGLISH",
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
  otp: String;
  otp_createdAt: Date;
  otp_expires: Date;
  language: { type: String; enum: Language; default: "VIETNAM" };
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
  productFavorites: [],
  currentProduct: [],
  otp: { type: String, require: true },
  otp_createdAt: { type: Date, require: true },
  otp_expires: { type: Date, require: true },
  language: { type: String, enum: Language, default: "VIETNAM" },
});

export default model<UserTypeModel>("User", userSchema);
