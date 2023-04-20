import { Schema, model, Document } from "mongoose";
import User from "models/user";
import { IModify, Modify } from "interfaces/basic";

/*********************TYPE & INTERFACE*****************************/

export type INotification = {
  id: string;
  title: string;
  body: string;
  image: string;
  from_user_id: string;
  to_user_id: string[];
  created_at: string;
  created_by: string;
  modify: IModify[];
  tokens?: string[];
};

export type NotificationTypeModel = INotification & Document;

/*******************************SCHEMA*****************************/

export const notificationSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  image: { type: String, required: true },
  from_user_id: { type: Schema.Types.ObjectId, ref: User },
  to_user_id: [{ type: Schema.Types.ObjectId, ref: User }],
  modify: { type: [Modify], require: true },
});

const Notification = model<NotificationTypeModel>(
  "Notification",
  notificationSchema
);

export default Notification;
