import Notification from "models/notification";
import { Request, Response } from "express";
import User from "models/user";

const getTokens = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    const tokens = users.map((user) => {
      if (user.device_id != "" && user.device_id != null) return user.device_id;
    });
    return res.json({ results: tokens });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getTokens;
