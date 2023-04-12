import { Request, Response } from "express";
import Voucher from "models/voucher";

const deleteVoucher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const voucher = await Voucher.findById(id);

    if (!voucher) return res.sendStatus(404);

    await Voucher.findByIdAndDelete(id);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default deleteVoucher;
