import { GENDER, ROLE, STATUS_USER } from "constants/user";
import { IModify, IOTP, Modify, OTP } from "interfaces/basic";
import {
  Address,
  IMembership,
  ISearchProduct,
  HistorySearch,
  IAddress,
  Membership,
} from "interfaces/user";
import { IVoucherUser, VoucherUser } from "interfaces/voucher";
import { Schema, model, Document } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export type IUser = {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  avatar: string;
  cover_image: string;
  gender: GENDER;
  birthday: string;
  addresses: IAddress[];
  status: STATUS_USER;
  favorite_products: string[];
  recently_products: string[];
  otp: IOTP;
  access_token: string;
  refresh_token: string;
  role: ROLE;
  membership: IMembership;
  vouchers: IVoucherUser[];
  history_search: ISearchProduct[];
  created_at: string;
  created_by: string;
  modify: IModify[];
  device_id: string;
};

export type UserTypeModel = IUser & Document;

/*******************************SCHEMA*****************************/

export const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String },
  full_name: { type: String, default: "" },
  phone: { type: String, default: "" },
  avatar: { type: String, default: "" },
  cover_image: { type: String, default: "" },
  gender: { type: String, enum: GENDER, default: GENDER.male },
  birthday: { type: String, default: "" },
  addresses: [Address],
  status: { type: String, enum: STATUS_USER, default: STATUS_USER.pending },
  favorite_products: { type: [Schema.Types.ObjectId], ref: "Product" },
  recently_products: { type: [Schema.Types.ObjectId], ref: "Product" },
  otp: { type: OTP, default: {} },
  access_token: { type: String },
  refresh_token: { type: String },
  role: { type: String, default: "user" },
  membership: {
    type: Membership,
    default: {
      name: "Basic",
      description: "You are a basic member, buy more to get more benefits",
      point: 0,
    },
  },
  vouchers: [VoucherUser],
  history_search: [HistorySearch],
  created_at: { type: String },
  created_by: { type: String },
  modify: [Modify],
  device_id: { type: String },
});

const User = model<UserTypeModel>("User", userSchema);

export default User;
