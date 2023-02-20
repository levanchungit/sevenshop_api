import { Schema, model, Document } from "mongoose";

/*********************TYPE & INTERFACE*****************************/

export type MetaDataType = {
  id: string;
  code: string;
  type: string;
  code_name: string;
  active: boolean;
  note: string;
  create_at: string;
  create_by: string;
  modify_at: string;
  modify_by: string;
};

export type MetaDataTypeModel = MetaDataType & Document;

/*******************************SCHEMA*****************************/

const metaDataSchema = new Schema({
  code: { type: String, required: true },
  type: { type: String, required: true },
  code_name: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
  note: { type: String, required: true },
  create_at: { type: String, require: true },
  create_by: { type: String, require: true },
  modify_at: { type: String, require: true },
  modify_by: { type: String, require: true },
});

const MetaData = model<MetaDataTypeModel>("MetaData", metaDataSchema);

export default MetaData;
