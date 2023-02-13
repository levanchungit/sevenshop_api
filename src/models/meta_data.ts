import { Schema, model, Document } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export type MetaDataType = {
  id: string;
  code: string;
  type: string;
  code_name: string;
  active: boolean;
  note: string;
  CRT_AT: Date;
  CRT_BY: string;
  MOD_AT: Date;
  MOD_BY: string;
};

export type MetaDataTypeModel = MetaDataType & Document;

/*******************************SCHEMA*****************************/

const metaDataSchema = new Schema({
  code: { type: String, required: true },
  type: { type: String, required: true },
  code_name: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
  note: { type: String, required: true },
  CRT_AT: { type: Date, required: true },
  CRT_BY: { type: String, required: true },
  MOD_AT: { type: Date, required: true },
  MOD_BY: { type: String, required: true },
});

const MetaData = model<MetaDataTypeModel>("MetaData", metaDataSchema);

export default MetaData;
