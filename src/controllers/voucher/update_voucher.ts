import { IVoucher } from "models/voucher";
import { Request, Response } from "express";
import Voucher from "models/voucher";
import User from "models/user";
import { getIdFromReq } from "utils/token";
import { getNow, validateFields } from "utils/common";

const updateVoucher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const { name, type, value, start_date, end_date } = req.body;

    const validateFieldsResult = validateFields(
      { name, type, value, start_date, end_date },
      [
        { name: "name", type: "string", required: true },
        { name: "type", type: "string", required: true },
        { name: "value", type: "number", required: true },
        { name: "start_date", type: "string", required: true },
        { name: "end_date", type: "string", required: true },
      ]
    );

    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });

    const voucher = await Voucher.findById(id);
    if (!voucher) return res.sendStatus(404);

    voucher.name = name;
    voucher.type = type;
    voucher.value = value;
    voucher.start_date = start_date;
    voucher.end_date = end_date;
    voucher.modify.push({
      action: `Update voucher '${voucher.name}' by ${user.email}`,
      date: getNow(),
    });

    await voucher.save();
    res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default updateVoucher;
