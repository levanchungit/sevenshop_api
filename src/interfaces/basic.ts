import { STATUS_ORDER } from "constants/order";

export type IModify = {
  action: string;
  date: string;
};

export type IOTP = {
  code: number | undefined;
  exp: string;
};

export const Modify = {
  action: String,
  date: String,
};

export const OTP = {
  code: Number,
  exp: String,
};

export type IModifyOrder = {
  status: STATUS_ORDER;
  modified_at: string;
  modified_by: string;
};

export const ModifyOrder = {
  status: { type: String, enum: Object.values(STATUS_ORDER) },
  modified_at: String,
  modified_by: String,
};
