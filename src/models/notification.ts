import { Schema, model, Document } from "mongoose";
import User from "models/user";

/*********************TYPE & INTERFACE*****************************/

export type NotificationType = {
  id: string;
  title: string;
  body: string;
  image: string;
  from_user_id: string;
  to_user_id: string[];
  CRT_AT: Date;
  CRT_BY: string;
  MOD_AT: Date;
  MOD_BY: string;
};

export type NotificationTypeModel = NotificationType & Document;

/*******************************SCHEMA*****************************/

export const notificationSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  image: { type: String, required: true },
  from_user_id: { type: Schema.Types.ObjectId, ref: User },
  to_user_id: [{ type: Schema.Types.ObjectId, ref: User }],
  CRT_AT: { type: Date, require: true },
  CRT_BY: { type: String, require: true },
  MOD_AT: { type: Date, require: true },
  MOD_BY: { type: String, require: true },
});

const Notification = model<NotificationTypeModel>(
  "Notification",
  notificationSchema
);

export default Notification;
