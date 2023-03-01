import Product from "models/product";
import { Schema, model, Document } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export enum GENDER {
  male = "male",
  female = "female",
  other = "other",
}

export enum LANGUAGE {
  vie = 1,
  eng = 2,
  kr = 3,
}

export enum STATUS {
  active = "active",
  inactive = "inactive",
  pending = "pending",
}

export enum ROLE {
  user = 1,
  admin = 2,
  staff = 3,
}

export type OTPType = {
  code: string;
  expired: Date;
};

export type AddressType = {
  address: string;
  full_name: string;
  phone: string;
  default_address: boolean;
};

export type UserType = {
  id: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
  image: string;
  gender: GENDER;
  birthday: string;
  address: AddressType[];
  status: STATUS;
  product_favorites: [];
  recent_products: string[];
  language: LANGUAGE;
  device_id: string;
  otp: OTPType;
  access_token: string;
  refresh_token: string;
  role_type: ROLE;
  membership_type: number;
  create_at: string;
  create_by: string;
  modify_at: string;
  modify_by: string;
};

export type UserTypeModel = UserType & Document;

/*******************************SCHEMA*****************************/

export const Otp = {
  code: String,
  expired: Date,
};

export const Address = {
  address: String,
  full_name: String,
  phone: String,
  default_address: Boolean,
};

export const userSchema = new Schema({
  email: { type: String },
  password: { type: String },
  full_name: { type: String },
  phone: { type: String },
  image: { type: String },
  gender: { type: String, enum: GENDER },
  birthday: { type: String },
  address: [{ type: Address }],
  status: { type: String, enum: STATUS, default: "pending" },
  product_favorites: [{ type: Schema.Types.ObjectId, ref: Product }],
  recent_products: [{ type: String }],
  language: { type: Number, enum: LANGUAGE, default: 1 },
  device_id: { type: String },
  otp: { type: Otp, default: {} },
  access_token: { type: String },
  refresh_token: { type: String },
  role_type: { type: Number, enum: ROLE, default: 1 },
  membership_type: { type: Number, default: 1 },
  create_at: { type: String, default: new Date() },
  create_by: { type: String },
  modify_at: { type: String },
  modify_by: { type: String },
});

const User = model<UserTypeModel>("User", userSchema);

export default User;
