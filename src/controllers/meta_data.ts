import { Request, Response } from "express";
import User from "models/user";
import MetaData, { MetaDataType } from "models/meta_data";
import MetaDataDetail, { MetaDataDetailType } from "models/meta_data_detail";
import { getIdFromReq } from "utils/token";
import moment from "moment";

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
  newMetaData.create_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
  newMetaData.create_by =
    user?.email + "_INS_" + moment(new Date()).format("YYYY-MM-DD HH:mm");
  await newMetaData.save();
  return res.status(200).json({
    message: "Insert success",
  });
};

export const insertDetail = async (req: Request, res: Response) => {
  const idUser = getIdFromReq(req);
  const user = await User.findById(idUser);
  const {
    code_name,
    meta_data_id,
    active,
    num1,
    num2,
    num3,
    num4,
    num5,
  }: MetaDataDetailType = req.body;
  const newMetaDataDetail = new MetaDataDetail({
    code_name,
    meta_data_id,
    active,
    num1,
    num2,
    num3,
    num4,
    num5,
  });
  newMetaDataDetail.create_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
  newMetaDataDetail.create_by =
    user?.email + "_INS_" + moment(new Date()).format("YYYY-MM-DD HH:mm");
  await newMetaDataDetail.save();
  return res.status(200).json({
    message: "Insert success",
  });
};

export const getAll = async (req: Request, res: Response) => {
  const { offset, limit } = req.query;
  const metaData = await MetaData.find({ active: true })
    .skip(parseInt(offset?.toString() ?? "0"))
    .limit(parseInt(limit?.toString() ?? "0"));
  return res.status(200).json({ result: metaData });
};

export const getAllDetail = async (req: Request, res: Response) => {
  const { offset, limit } = req.query;
  const metaDataDetail = await MetaDataDetail.find({ active: true })
    .skip(parseInt(offset?.toString() ?? "0"))
    .limit(parseInt(limit?.toString() ?? "0"));
  return res.status(200).json({ result: metaDataDetail });
};

export const get = async (req: Request, res: Response) => {
  const _id = req.params.id;
  const metaData = await MetaData.findById({ _id });
  if (metaData) {
    res.status(200).json(metaData);
  } else {
    res.status(404).json({ message: "MetaData not found" });
  }
};

export const getDetail = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const metaDataDetail = await MetaDataDetail.findById({ _id });
    if (metaDataDetail) {
      res.status(200).json(metaDataDetail);
    } else {
      res.status(404).json({ message: "MetaDataDetail not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const getDetailByMetaDataID = async (req: Request, res: Response) => {
  try {
    const { meta_data_id } = req.params;
    const metaDataDetail = await MetaDataDetail.find({ meta_data_id });

    if (metaDataDetail) {
      res.status(200).json(metaDataDetail);
    } else {
      res.status(404).json({ message: "Detail Meta Data ID not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const idUser = getIdFromReq(req);
    const user = await User.findOne({ _id: idUser });
    const { code, type, code_name, active, note }: MetaDataType = req.body;
    const metaDataOld = await MetaData.findOne({ _id });
    if (metaDataOld) {
      const _modify_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
      const _modify_by =
        (metaDataOld?.modify_by ? metaDataOld?.modify_by : "") +
        "" +
        user?.email +
        "_UDP_" +
        moment(new Date()).format("YYYY-MM-DD HH:mm") +
        " | ";
      const updateMetaData = await MetaData.findOneAndUpdate(
        { _id },
        {
          $set: {
            code,
            type,
            code_name,
            active,
            note,
            modify_at: _modify_at,
            modify_by: _modify_by,
          },
        },
        { new: true }
      );
      if (updateMetaData) {
        return res.status(200).json(updateMetaData);
      }
    } else {
      res.status(404).json({ message: "Not found meta data" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const updateDetail = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const idUser = getIdFromReq(req);
    const user = await User.findOne({ _id: idUser });
    const {
      code,
      code_name,
      meta_data_id,
      active,
      num1,
      num2,
      num3,
      num4,
      num5,
      kr,
      eng,
    }: MetaDataDetailType = req.body;
    const metaDataDetailOld = await MetaDataDetail.findOne({ _id });
    if (metaDataDetailOld) {
      const _modify_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
      const _modify_by =
        (metaDataDetailOld?.modify_by ? metaDataDetailOld?.modify_by : "") +
        "" +
        user?.email +
        "_UDP_" +
        moment(new Date()).format("YYYY-MM-DD HH:mm") +
        " | ";
      const updateMetaDataDetail = await MetaDataDetail.findOneAndUpdate(
        { _id },
        {
          $set: {
            code,
            code_name,
            meta_data_id,
            active,
            num1,
            num2,
            num3,
            num4,
            num5,
            kr,
            eng,
            modify_at: _modify_at,
            modify_by: _modify_by,
          },
        },
        { new: true }
      );
      if (updateMetaDataDetail) {
        return res.status(200).json(updateMetaDataDetail);
      }
    } else {
      res.status(404).json({ message: "Not found meta data detail" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const deleteMetaData = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const deleteMetaData = await MetaData.deleteOne({ _id });
    if (deleteMetaData) {
      res.status(200).json({ message: true });
    } else {
      res.status(500).json({ message: "Delete failed." });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const deleteMetaDataDetail = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const deleteMetaDataDetail = await MetaDataDetail.deleteOne({ _id });
    if (deleteMetaDataDetail) {
      res.status(200).json({ message: true });
    } else {
      res.status(500).json({ message: "Delete failed." });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
