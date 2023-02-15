import { Role } from "./../models/user";
import { Request, Response } from "express";
import User, { Status, UserType } from "models/user";
import MetaData, { MetaDataType } from "models/meta_data";
import MetaDataDetail, { MetaDataDetailType } from "models/meta_data_detail";
import { getIdFromReq, parseJwt, tokenGen } from "utils/token";
import Log from "libraries/log";

export const insert = async (req: Request, res: Response) => {
  const idUser = getIdFromReq(req);
  const user = await User.findById(idUser);
  const { code, type, code_name, note }: MetaDataType = req.body;
  const newMetaData = new MetaData({
    code,
    type,
    code_name,
    note,
  });
  newMetaData.create_at = new Date();
  newMetaData.create_by = "INSERT BY " + user?.email + "|";
  await newMetaData.save();
  return res.status(200).json({
    message: "Insert success",
  });
};

export const insertDetail = async (req: Request, res: Response) => {
  const idUser = getIdFromReq(req);
  const user = await User.findById(idUser);
  const { code_name, meta_data_id }: MetaDataDetailType = req.body;
  const newMetaDataDetail = new MetaDataDetail({
    code_name,
    meta_data_id,
  });
  newMetaDataDetail.create_at = new Date();
  newMetaDataDetail.create_by = "INSERT BY " + user?.email + "|";
  await newMetaDataDetail.save();
  return res.status(200).json({
    message: "Insert success",
  });
};

export const getAll = async (req: Request, res: Response) => {
  const { offset, limit } = req.query;
  const metaData = await MetaData.find()
    .skip(parseInt(offset?.toString() ?? "0"))
    .limit(parseInt(limit?.toString() ?? "0"));
  return res.status(200).json({ result: metaData });
};

export const getAllDetail = async (req: Request, res: Response) => {
  const { offset, limit } = req.query;
  const metaDataDetail = await MetaDataDetail.find()
    .skip(parseInt(offset?.toString() ?? "0"))
    .limit(parseInt(limit?.toString() ?? "0"));
  return res.status(200).json({ result: metaDataDetail });
};

export const get = async (req: Request, res: Response) => {
  const _id = req.params.id;
  const metaData = await MetaData.findById(_id);
  if (metaData) {
    res.status(200).json({ result: metaData });
  } else {
    res.status(404).json({ message: "MetaData not found" });
  }
};

export const getDetail = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const metaDataDetail = await MetaDataDetail.findById(_id);
    if (metaDataDetail) {
      res.status(200).json({ result: metaDataDetail });
    } else {
      res.status(404).json({ message: "MetaDataDetail not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const update = async (req: Request, res: Response) => {};

export const remove = async (req: Request, res: Response) => {
  return res.status(400).json({ message: "OTP is invalid" });
};
