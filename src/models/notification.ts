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
  create_at: Date;
  create_by: string;
  modify_at: Date;
  modify_by: string;
};

export type NotificationTypeModel = NotificationType & Document;

/*******************************SCHEMA*****************************/

export const notificationSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  image: { type: String, required: true },
  from_user_id: { type: Schema.Types.ObjectId, ref: User },
  to_user_id: [{ type: Schema.Types.ObjectId, ref: User }],
  create_at: { type: Date, require: true },
  create_by: { type: String, require: true },
  modify_at: { type: Date, require: true },
  modify_by: { type: String, require: true },
});

const Notification = model<NotificationTypeModel>(
  "Notification",
  notificationSchema
);

export default Notification;
