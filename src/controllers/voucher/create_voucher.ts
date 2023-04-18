import { TYPE_VOUCHER } from "constants/voucher";
import { Request, Response } from "express";
import Size, { ISize } from "models/size";
import User from "models/user";
import Voucher, { IVoucher } from "models/voucher";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const createVoucher = async (req: Request, res: Response) => {
  try {
    const { name, quantity, type, value, start_date, end_date }: IVoucher =
      req.body;
    const validateFieldsResult = validateFields(
      { name, quantity, type, value, start_date, end_date },
      [
        { name: "name", type: "string", required: true },
        { name: "quantity", type: "number", required: true },
        { name: "type", type: "string", required: true },
        { name: "value", type: "number", required: true },
        { name: "start_date", type: "date", required: true },
        { name: "end_date", type: "date", required: true },
      ]
    );
    if (!Object.values(TYPE_VOUCHER).includes(type)) {
      const message = `Voucher type '${type}' is not valid`;
      return res.status(400).json({ message });
    }
    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });

    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    const existingVoucher = await Voucher.findOne({ name });
    if (existingVoucher) {
      const message = `Voucher name '${name}' already exists`;
      return res.status(409).json({ message });
    }

    //generate string code voucher random not
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newVoucher = new Voucher({
      name,
      code,
      quantity,
      type,
      value,
      start_date,
      end_date,
      created_at: getNow(),
      created_by: user.email,
      modify: [{ action: `Create by ${user?.email}`, date: getNow() }],
    });
    await newVoucher.save();
    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default createVoucher;
