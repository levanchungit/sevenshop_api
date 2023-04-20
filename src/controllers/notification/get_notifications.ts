import Notification from "models/notification";
import { Request, Response } from "express";
import User from "models/user";

//get notifications
const getNotifications = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sort = (req.query.sort as string) || "name";
  const startIndex = (page - 1) * limit;
  const total = await Notification.countDocuments();

  const notifications: any = await Notification.find()
    .sort(sort)
    .limit(limit)
    .skip(startIndex);

  const userIds = notifications.map(
    (notification: any) => notification.from_user_id
  );
  const users = await User.find({ _id: { $in: userIds } });

  const notificationData = notifications.map((notification: any) => {
    const user = users.find(
      (user) => user._id.toString() === notification.from_user_id.toString()
    );
    const fullName = user ? user.full_name : null;
    return {
      ...notification._doc,
      from_user_full_name: fullName,
    };
  });

  const results = {
    total: total,
    page: page,
    limit: limit,
    results: notificationData,
  };
  return res.json(results);
};

export default getNotifications;
