import { TYPE_VOUCHER } from "constants/voucher";
import { IModify, Modify } from "interfaces/basic";
import { Document, model, Schema } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export type IVoucher = {
  _id?: string;
  name: string;
  code: string;
  quantity: number;
  type: TYPE_VOUCHER;
  value: number;
  start_date: string;
  end_date: string;
  created_at: string;
  created_by: string;
  modify: IModify[];
};

export type VoucherTypeModel = IVoucher & Document;

/*******************************SCHEMA*****************************/

const voucherSchema: Schema = new Schema({
  name: { type: String, require: true },
  code: { type: String, require: true },
  quantity: { type: Number, require: true },
  type: { type: String, enum: Object.values(TYPE_VOUCHER), require: true },
  value: { type: Number, require: true },
  start_date: { type: String, require: true },
  end_date: { type: String, require: true },
  created_at: { type: String, require: true },
  created_by: { type: String, require: true },
  modify: { type: [Modify], require: true },
});

const Voucher = model<VoucherTypeModel>("Voucher", voucherSchema);

export default Voucher;
