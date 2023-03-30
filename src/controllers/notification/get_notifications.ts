import Notification from "models/notification";
import { Request, Response } from "express";

//get notifications
const getNotifications = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sort = (req.query.sort as string) || "name";
  const startIndex = (page - 1) * limit;
  const total = await Notification.countDocuments();

  const notifications = await Notification.find()
    .sort(sort)
    .limit(limit)
    .skip(startIndex);

  const results = {
    total: total,
    page: page,
    limit: limit,
    results: notifications,
  };
  return res.json(results);
};

export default getNotifications;
