import { Request, Response } from "express";
import User from "models/user";
import { isValidObjectId } from "mongoose";
import { getIdFromReq } from "utils/token";

const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const { id } = req.params;
    if (!id) return res.sendStatus(404);
    if (!isValidObjectId(id)) return res.sendStatus(404);
     const address = user.addresses.find((item) => item._id?.toString() === id);
    if (!address) return res.sendStatus(404);
    user.addresses = user.addresses.map((item) => {
      item.default_address = false;
      return item;
    });
    address.default_address = true;
    await user.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default setDefaultAddress;
