import Product from "models/product";
import { Schema, model, Document } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export enum GENDER {
  male = "male",
  female = "female",
  other = "other",
}

export enum LANGUAGE {
  vi = "vi",
  en = "en",
}

export enum STATUS {
  active = "active",
  inactive = "inactive",
  pending = "pending",
}

export enum ROLE {
  user = "user",
  admin = "admin",
  staff = "staff",
}

export type AddressType = {
  full_name: string;
  phone: string;
  address: string;
};

export type OTPType = {
  code: string;
  expired: Date;
};

export type UserType = {
  id: string;
  email: string;
  username: string;
  password: string;
  full_name: string;
  phone: string;
  image: string;
  gender: GENDER;
  birthday: string;
  addresses: [AddressType];
  status: STATUS;
  roles: [ROLE];
  product_favorites: [];
  recent_products: [];
  access_token: string;
  refresh_token: string;
  otp: OTPType;
  language: LANGUAGE;
};

export type UserTypeModel = UserType & Document;

/*******************************SCHEMA*****************************/
export const Address = {
  full_name: String,
  phone: String,
  address: String,
};

export const OTP = {
  code: String,
  expired: Date,
};

export const userSchema = new Schema({
  email: { type: String, require: true },
  username: { type: String, require: true },
  password: { type: String, require: true },
  full_name: { type: String, require: true },
  phone: { type: String, require: true },
  image: { type: String, require: true },
  gender: { type: String, require: true },
  birthday: { type: String, require: true },
  addresses: { type: [Address], default: [] },
  status: { type: String, enum: STATUS, default: "pending" },
  roles: { type: String, enum: ROLE, default: "user" },
  product_favorites: [{ type: Schema.Types.ObjectId, ref: Product }],
  recent_products: [{ type: Schema.Types.ObjectId, ref: Product }],
  otp: { type: OTP, default: {} },
  access_token: { type: String, require: true },
  refresh_token: { type: String, require: true },
  language: { type: String, enum: LANGUAGE, default: "vi" },
});

const User = model<UserTypeModel>("User", userSchema);

export default User;
