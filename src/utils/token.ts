import jwt from "jsonwebtoken";
import { Request } from "express";

export const tokenGen = (data: any, expiresIn: number) =>
  jwt.sign(data, process.env.JWT_SECRET || "", { expiresIn: expiresIn * 60 });

export const parseJwt = (token: string) =>
  JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());

export const getIdFromReq = (req: Request) =>
  parseJwt(req.headers.authorization?.slice(7) ?? "")._id;

export const getRoleFromReq = (req: Request): Partial<string> =>
  parseJwt(req.headers.authorization?.slice(7) ?? "").role;

export const haveToken = (req: Request) =>
  Boolean(req.headers.authorization?.slice(7));
