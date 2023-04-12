import { Request, Response } from "express";
import User from "models/user";
import { getNow, validateFields } from "utils/common";

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.sendStatus(403);

    await User.findByIdAndDelete(id);
    return res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

export default deleteUser;
