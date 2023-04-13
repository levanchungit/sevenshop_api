import { STATUS_VOUCHER_USER } from "./../../constants/voucher";
import { TYPE_VOUCHER } from "constants/voucher";
import { Request, Response } from "express";
import Size, { ISize } from "models/size";
import User from "models/user";
import Voucher, { IVoucher } from "models/voucher";
import { formatDateTime, getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const addVoucherUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    const voucher = await Voucher.findById(id);
    if (!voucher) return res.sendStatus(404);

    //check voucher.end_date is expired
    if (formatDateTime(voucher.end_date) < getNow()) {
      return res.status(400).json({ message: "Voucher is expired" });
    }

    //check voucher exists in user.vouchers
    const voucherExists = user.vouchers.find(
      (voucher) => voucher.voucher_id == id
    );
    if (voucherExists) {
      return res.status(400).json({ message: "Voucher is exists" });
    }

    //add voucher to user
    user.vouchers.push({
      voucher_id: voucher._id,
      status: STATUS_VOUCHER_USER.unused,
    });

    user.modify.push({
      action: `Add voucher ${voucher.name} by ${user.email}`,
      date: getNow(),
    });
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

export default addVoucherUser;
