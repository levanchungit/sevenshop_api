import { STATUS_VOUCHER_USER } from "constants/voucher";
import { ObjectId, Schema } from "mongoose";

export type IVoucherUser = {
  _id?: string;
  voucher_id: string;
  status: STATUS_VOUCHER_USER;
};

export const VoucherUser = {
  voucher_id: { type: Schema.Types.ObjectId, ref: "Voucher" },
  status: { type: String, enum: Object.values(STATUS_VOUCHER_USER) },
};
