import Product from "models/product";
import { Schema, model, Document } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export enum Gender {
  male = "male",
  female = "female",
  other = "other",
}

export enum Language {
  vie = 1,
  eng = 2,
  kr = 3,
}

export enum Status {
  active = "active",
  inactive = "inactive",
  pending = "pending",
}

export enum Role {
  user = 1,
  admin = 2,
  staff = 3,
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
  image: string;
  gender: Gender;
  birthday: Date;
  address: string;
  status: Status;
  product_favorites: [];
  recent_products: [];
  language: Language;
  device_id: string;
  otp: OTPType;
  access_token: string;
  refresh_token: string;
  role_type: Role;
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

export const userSchema = new Schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  full_name: { type: String, require: true },
  phone: { type: String, require: true },
  image: { type: String, require: true },
  gender: { type: String, enum: Gender, require: true },
  birthday: { type: Date, require: true },
  address: { type: String, require: true },
  status: { type: String, enum: Status, default: "pending" },
  product_favorites: [{ type: Schema.Types.ObjectId, ref: Product }],
  recent_products: [{ type: Schema.Types.ObjectId, ref: Product }],
  language: { type: Number, enum: Language, default: 1 },
  device_id: { type: String, require: true },
  otp: { type: Otp, default: {} },
  access_token: { type: String, require: true },
  refresh_token: { type: String, require: true },
  role_type: { type: Number, enum: Role, default: 1 },
  membership_type: { type: Number, require: true, default: 1 },
  create_at: { type: String, default: new Date() },
  create_by: { type: String, require: true },
  modify_at: { type: String, require: true },
  modify_by: { type: String, require: true },
});

const User = model<UserTypeModel>("User", userSchema);

export default User;
