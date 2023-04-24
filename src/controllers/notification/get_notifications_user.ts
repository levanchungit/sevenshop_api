import Notification, { INotification } from "models/notification";
import { Request, Response } from "express";
import { request } from "http";

//get notifications
const getNotificationsUser = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { user_id } = req.params;

    //get notifications by user_id. user_id $in to_user_id
    let total = 0;
    const obj: INotification[] = [];
    const notifications = await Notification.find({}).limit(limit).skip(page);
    notifications.forEach((notification) => {
      notification.to_user_id.forEach((id) => {
        if (id.toString() === user_id.toString()) {
          total++;
          obj.push(notification);
        }
      });
    });

    const results = {
      total: total,
      page: page,
      limit: limit,
      results: obj,
    };
    return res.json(results);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getNotificationsUser;
