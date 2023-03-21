import { Request, Response } from "express";
import User, { IUser } from "models/user";

const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "created_at";
    const startIndex = (page - 1) * limit;
    const total = await User.countDocuments();

    const users: IUser[] = await User.find()
      .sort(sort)
      .limit(limit)
      .skip(startIndex);

    const results = {
      total: total,
      page: page,
      limit: limit,
      results: users,
    };

    return res.json(results);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getUsers;
