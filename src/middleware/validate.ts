import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.slice(7); // cut Bearer
  console.log(token);

  if (!token)
    return res.status(401).json({ error: true, message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "");
    next();
  } catch (err) {
    return res.status(400).json({ error: true, message: "Invalid Token" });
  }
};
