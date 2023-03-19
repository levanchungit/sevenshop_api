import { Request, Response } from "express";
import User from "models/user";

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getUsers;
