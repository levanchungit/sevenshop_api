import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import moment from "moment";
import { floor, parseInt } from "lodash";
import User, { UserType } from "../models/user";
import { tokenGen, getIdFromReq, parseJwt } from "../utils/token";

let refreshTokens: string[] = [];

const signup = async (req: Request, res: Response, next: NextFunction) => {};

const login = async (req: Request, res: Response, next: NextFunction) => {};

const logout = (req: Request, res: Response, next: NextFunction) => {};


export default {
  login,
  logout,
  signup,
};
