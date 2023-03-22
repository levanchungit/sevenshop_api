import { getIdFromReq } from "utils/token";
import { Request, Response } from "express";
import User from "models/user";
import { getNow } from "utils/common";
import { isValidObjectId } from "mongoose";

const deleteAddress = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const { id } = req.params;
    if (!id) return res.sendStatus(404);
    if (!isValidObjectId(id)) return res.sendStatus(404);
    const address = user.addresses.find((item) => item._id?.toString() === id);
    if (!address) return res.sendStatus(404);
    if (address.default_address) return res.status(400).json({ message: "You can't delete default address" });
    user.addresses = user.addresses.filter((item) => item._id?.toString() !== id);
    user.modify.push({
      action: `Delete address '${address.address}' by ${user?.email}`,
      date: getNow(),
    });
    await user.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default deleteAddress;
