import jwt from "jsonwebtoken";
import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();

export const tokenGen = (data: any, days?: number) => {
  return jwt.sign(data, process.env.JWT_SECRET || "", {
    expiresIn: 60 * 60 * 24 * (days || 1), //1 day
  });
};

export const parseJwt = (token: string) => {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
};

export const getIdFromReq = (req: Request) => {
  const token = req.header("Authorization")?.slice(7); // cut 'Bearer '
  const _id = parseJwt(token ?? "")._id;

  return _id as string;
};
