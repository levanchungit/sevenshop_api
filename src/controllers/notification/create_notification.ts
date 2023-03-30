import Notification, { INotification } from "models/notification";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";
import { Request, Response } from "express";
import User from "models/user";

//create notification
const createNotification = async (req: Request, res: Response) => {
  const user = await User.findById(getIdFromReq(req));
  if (!user) return res.sendStatus(403);
  try {
    const { title, body, image, to_user_id }: INotification = req.body;

    const validateFieldsResult = validateFields(
      {
        title,
        body,
        image,
        from_user_id: user._id,
        to_user_id,
      },
      [
        { name: "title", type: "string", required: true },
        { name: "body", type: "string", required: true },
        { name: "image", type: "string", required: true },
        { name: "to_user_id", type: "arrayString", required: true },
      ]
    );
    if (validateFieldsResult)
      return res.sendStatus(400).json({ message: validateFieldsResult });

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
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export default createNotification;
