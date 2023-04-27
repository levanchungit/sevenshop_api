import Notification, { INotification } from "models/notification";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";
import { Request, Response } from "express";
import User from "models/user";
var admin = require("firebase-admin");

const pushNotificationsAll = async (
  req: Request,
  res: Response,
  notificationObject: any
) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    let { title, body, image }: INotification = req.body;

    if (!title)
      return res.status(400).json({ title, message: "Title not exists" });
    if (!body) return res.status(400).json({ message: "Body not exists" });
    if (!image)
      image =
        "https://res.cloudinary.com/dzhlsdyqv/image/upload/v1681919879/Image/Logo_128_zzjr4f.png";

    //get array device_id by user
    const user_ids: string[] = [];
    const users = await User.find({});
    const tokens: string[] = [];
    users.map((user) => {
      if (user.device_id != undefined) {
        user_ids.push(user._id);
        tokens.push(user.device_id);
      }
    });

    console.log(tokens);

    //send notification to multiple devices
    const message = {
      data: {
        customData: "SevenShop",
        id: "1",
        ad: "SevenShop",
        subTitle: "SevenShop",
      },
      android: {
        notification: {
          body: body,
          title: title,
          color: "#AC1506",
          priority: "high",
          sound: "default",
          vibrateTimingsMillis: [200, 500, 800],
          imageUrl: image,
        },
      },
      tokens: tokens,
    };

    //push notification
    admin
      .messaging()
      .sendMulticast(message)
      .then(async (msg: any) => {
        console.log("SUCCESSFULLY PUSH NOTIFICATION");

        const notification = new Notification({
          title,
          body,
          image,
          from_user_id: user._id,
          to_user_id: user_ids,
          created_at: getNow(),
          created_by: `${user.email}`,
          modify: [{ action: `Create by ${user.email}`, date: getNow() }],
        });

        await notification.save();
        return res.sendStatus(201);
      })
      .catch((err: any) => {
        console.log("ERR catch notification", err);
      });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export default pushNotificationsAll;
