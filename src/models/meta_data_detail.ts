import { Schema, model, Document } from "mongoose";
import MetaData from "models/meta_data";

/*********************TYPE & INTERFACE*****************************/

export type MetaDataDetailType = {
  id: string;
  code_name: string;
  meta_data_id: string;
  active: boolean;
  num1: string;
  num2: Number;
  num3: Number;
  num4: string;
  num5: Date;
  create_at: string;
  create_by: string;
  modify_at: string;
  modify_by: string;
  eng: string;
  kr: string;
};

export type MetaDataDetailTypeModel = MetaDataDetailType & Document;

/*******************************SCHEMA*****************************/

export const metaDataDetailSchema = new Schema({
  code_name: { type: String, required: true },
  meta_data_id: { type: Schema.Types.ObjectId, ref: MetaData },
  active: { type: Boolean, default: true },
  num1: { type: String },
  num2: { type: Number },
  num3: { type: Number },
  num4: { type: String },
  num5: { type: Date },
  create_at: { type: String, require: true },
  create_by: { type: String, require: true },
  modify_at: { type: String, require: true },
  modify_by: { type: String, require: true },
  eng: { type: String },
  kr: { type: String },
});

const MetaDataDetail = model<MetaDataDetailTypeModel>(
  "MetaDataDetail",
  metaDataDetailSchema
);
export default MetaDataDetail;
