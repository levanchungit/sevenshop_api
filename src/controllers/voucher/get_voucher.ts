import { IVoucher } from "models/voucher";
import { Request, Response } from "express";
import Voucher from "models/voucher";

const getVoucherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);

    return res.json(voucher);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getVoucherById;
