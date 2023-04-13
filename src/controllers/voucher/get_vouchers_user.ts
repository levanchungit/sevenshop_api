import { IVoucher } from "models/voucher";
import { Request, Response } from "express";
import Voucher from "models/voucher";
import User from "models/user";
import { getIdFromReq } from "utils/token";

const getVouchersUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    //get all voucher id of user.vouchers.voucher_id
    const voucherId = user.vouchers.map((voucher) => voucher.voucher_id);
    console.log(voucherId);
    const voucher = await Voucher.find({
      _id: { $in: voucherId },
    });

    return res.json({ results: voucher });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getVouchersUser;
