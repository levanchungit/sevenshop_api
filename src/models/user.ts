import Product from "models/product";
import { Schema, model, Document } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export enum GENDER {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum LANGUAGE {
  VIE = 1,
  ENG = 2,
  KR = 3,
}

export enum STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export enum ROLE {
  USER = 1,
  ADMIN = 2,
  STAFF = 3,
}

export type OTPType = {
  code: string;
  expired: Date;
};

export type UserType = {
  id: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
  image: [];
  gender: GENDER;
  birthday: Date;
  address: string;
  status: STATUS;
  product_favorites: [];
  recent_products: [];
  language: LANGUAGE;
  device_id: string;
  otp: OTPType;
  access_token: string;
  refresh_token: string;
  role_type: ROLE;
  membership_type: number;
  CRT_AT: Date;
  CRT_BY: string;
  MOD_AT: Date;
  MO_BY: string;
};

export type UserTypeModel = UserType & Document;

/*******************************SCHEMA*****************************/

export const OTP = {
  code: String,
  expired: Date,
};

export const userSchema = new Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  full_name: { type: String, require: true },
  phone: { type: String, require: true },
  image: { type: [String], require: true },
  gender: { type: String, enum: GENDER, require: true },
  birthday: { type: Date, require: true },
  address: { type: String, require: true },
  status: { type: String, enum: STATUS, default: "PENDING" },
  product_favorites: [{ type: Schema.Types.ObjectId, ref: Product }],
  recent_products: [{ type: Schema.Types.ObjectId, ref: Product }],
  language: { type: Number, enum: LANGUAGE, default: 1 },
  device_id: { type: String, require: true },
  otp: { type: OTP, default: {} },
  access_token: { type: String, require: true },
  refresh_token: { type: String, require: true },
  role_type: { type: Number, enum: ROLE, default: 1 },
  membership_type: { type: Number, require: true, default: 1 },
  CRT_AT: { type: Date, require: true },
  CRT_BY: { type: String, require: true },
  MOD_AT: { type: Date, require: true },
  MOD_BY: { type: String, require: true },
});

const User = model<UserTypeModel>("User", userSchema);

export default User;
