import { IVoucher } from "models/voucher";
import { Request, Response } from "express";
import Voucher from "models/voucher";
import User from "models/user";
import { getIdFromReq } from "utils/token";
import { STATUS_VOUCHER_USER } from "constants/voucher";

const getVouchersUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    //get all voucher id of user.vouchers.voucher_id
    const voucherUsed = user.vouchers
      .filter((voucher) => voucher.status === STATUS_VOUCHER_USER.used)
      .map((voucher) => voucher.voucher_id);
    const voucherUnused = user.vouchers
      .filter((voucher) => voucher.status === STATUS_VOUCHER_USER.unused)
      .map((voucher) => voucher.voucher_id);

    const _voucherUsed = await Voucher.find(
      {
        _id: { $in: voucherUsed },
      },
      {
        name: 1,
        code: 1,
        type: 1,
        value: 1,
        start_date: 1,
        end_date: 1,
      }
    );

    const _voucherUnused = await Voucher.find(
      {
        _id: { $in: voucherUnused },
      },
      {
        name: 1,
        code: 1,
        type: 1,
        value: 1,
        start_date: 1,
        end_date: 1,
      }
    );

    return res.json({
      results: { used: _voucherUsed, unused: _voucherUnused },
    });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getVouchersUser;
