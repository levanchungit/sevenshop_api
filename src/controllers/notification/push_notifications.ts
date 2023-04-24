import Notification, { INotification } from "models/notification";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";
import { Request, Response } from "express";
import User from "models/user";
var admin = require("firebase-admin");

var serviceAccount = require("../../../pushnotification-sevenshop-firebase-adminsdk-8qqx2-c491f5c4f7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const pushNotifications = async (
  req: Request,
  res: Response,
  notificationObject: any
) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    let { title, body, image, to_user_id, tokens }: INotification = req.body;

    console.log(req.body, title, body, image, to_user_id, tokens);

    if (notificationObject) {
      title = notificationObject.title;
      body = notificationObject.body;
      image = notificationObject.image;
      to_user_id = notificationObject.to_user_id;
      tokens = notificationObject.tokens;
    }

    console.log(notificationObject);

    const validateFieldsResult = validateFields(
      {
        title,
        body,
        image,
        from_user_id: user._id,
        to_user_id,
        tokens,
      },
      [
        { name: "title", type: "string", required: true },
        { name: "body", type: "string", required: true },
        { name: "image", type: "string", required: true },
        { name: "to_user_id", type: "arrayString", required: true },
        { name: "tokens", type: "arrayString", required: true },
      ]
    );
    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });

    //check to_user_id array exists
    const users = await User.find({ _id: { $in: to_user_id } });
    if (users.length !== to_user_id.length)
      return res.status(400).json({ message: "User not exists" });

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
          to_user_id,
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

export default pushNotifications;
