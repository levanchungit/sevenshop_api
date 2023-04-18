import { STATUS_VOUCHER_USER } from "./../../constants/voucher";
import { Request, Response } from "express";
import User from "models/user";
import Voucher from "models/voucher";
import moment from "moment";
import mongoose from "mongoose";
import { getNow } from "utils/common";
import { getIdFromReq } from "utils/token";

const addVoucherUser = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const voucher = await Voucher.findOne({ code });
    if (!voucher) return res.sendStatus(404);

    //check voucher is expired
    const now = moment(getNow());
    const start_date = moment(voucher.start_date);
    const end_date = moment(voucher.end_date).add(1, "days");
    if (now.isBefore(start_date) || now.isAfter(end_date)) {
      return res.status(400).json({ message: "Voucher is expired" });
    }

    //check voucher exists in user.vouchers
    const voucherExists = user.vouchers.find(
      (itemVoucher) => itemVoucher.voucher_id.toString() == voucher._id
    );
    if (voucherExists) {
      return res.status(400).json({ message: "Voucher is exists." });
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

    //update quantity voucher
    voucher.quantity = voucher.quantity - 1;

    voucher.modify.push({
      action: `Voucher ${voucher.name} add to ${user.email}`,
      date: getNow(),
    });

    await user.save();
    await voucher.save();
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

export default addVoucherUser;
