import { PAYMENT_TYPE, STATUS_ORDER } from "constants/order";
import { Request, Response } from "express";
import { IInvoice } from "interfaces/invoice";
import Order from "models/order";
import User from "models/user";
import { getNow } from "utils/common";
import { getIdFromReq } from "utils/token";

const checkout = async (req: Request, res: Response) => {
  try {
    const id_user = getIdFromReq(req);
    const user = await User.findById(id_user);
    if (!user) {
      return res.sendStatus(403);
    }
    const {
      products,
      total_invoice,
      total_invoice_before_discount,
      total_invoice_discount,
      payment_type,
      address,
      note,
      voucher_id,
    }: IInvoice = req.body;

    //check address exists in user
    const addressExists = user.addresses.find(
      (item) => item._id.toString() === address?._id.toString()
    );
    if (!addressExists) {
      return res.status(400).json({ message: "Address is not exists" });
    }

    if (payment_type === PAYMENT_TYPE.cod) {
      const newOrder = new Order({
        user_id: id_user,
        products,
        total_price: total_invoice,
        total_discount: total_invoice_discount,
        total_before_discount: total_invoice_before_discount,
        payment_type,
        address,
        note,
        voucher_id,
        status: STATUS_ORDER.pending,
        created_at: getNow(),
        created_by: user.email,
        modify: [
          {
            status: STATUS_ORDER.pending,
            modify_at: getNow(),
            modify_by: `${user.email} send order`,
          },
        ],
      });
      await newOrder.save();
      return res.sendStatus(201);
    }
    return res.sendStatus(501);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default checkout;
