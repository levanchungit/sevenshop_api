import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { parseJwt } from "utils/token";
import User from "models/user";
import Log from "libraries/log";

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.slice(7); // cut Bearer
  if (!token) {
    Log.error(`Access denied: ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    const _id = parseJwt(token)._id;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.access_token !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
  try {
    await jwt.verify(token, process.env.JWT_SECRET || "");
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
