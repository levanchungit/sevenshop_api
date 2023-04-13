import User, { IUser } from "models/user";
import { Request, Response } from "express";

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: IUser | null = await User.findById(id);
    if (!user) {
      return res.sendStatus(404);
    }
    return res.json(user);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getUserById;
