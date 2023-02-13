import { Schema, model, Document } from "mongoose";
import MetaData from "models/meta_data";

/*********************TYPE & INTERFACE*****************************/

export type MetaDataDetailType = {
  id: string;
  code: string;
  code_name: string;
  meta_data_id: string;
  active: boolean;
  num1: string;
  num2: Number;
  num3: Number;
  num4: string;
  num5: Date;
  CRT_AT: Date;
  CRT_BY: string;
  MOD_AT: Date;
  MOD_BY: string;
  ENG: string;
  KR: string;
};

export type MetaDataDetailTypeModel = MetaDataDetailType & Document;

/*******************************SCHEMA*****************************/

export const metaDataDetailSchema = new Schema({
  code: { type: String, required: true },
  code_name: { type: String, required: true },
  meta_data_id: { type: Schema.Types.ObjectId, ref: MetaData },
  active: { type: Boolean, required: true },
  num1: { type: String },
  num2: { type: Number },
  num3: { type: Number },
  num4: { type: String },
  num5: { type: Date },
  CRT_AT: { type: Date },
  CRT_BY: { type: String },
  MOD_AT: { type: Date },
  MOD_BY: { type: String },
  ENG: { type: String },
  KR: { type: String },
});

const MetaDataDetail = model<MetaDataDetailTypeModel>(
  "MetaDataDetail",
  metaDataDetailSchema
);
export default MetaDataDetail;
