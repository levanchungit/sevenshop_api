import { Request, Response } from "express";
import { IAddress } from "interfaces/user";
import User from "models/user";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const createAddress = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const { address, full_name, phone, default_address }: IAddress = req.body;
    const validateFieldsResult = validateFields(
      { address, full_name, phone, default_address },
      [
        { name: "address", type: "string", required: true },
        { name: "full_name", type: "string", required: true },
        { name: "phone", type: "string", required: true },
        { name: "default_address", type: "boolean", required: true },
      ]
    );
    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });
    const existingAddress = user.addresses.find(
      (item) => item.address === address && item.phone === phone
    );
    if (existingAddress) {
      const message = `Address '${address}' by ${phone} already exists`;
      return res.status(409).json({ message });
    }
    let message = "";
    if (default_address) {
      user.addresses.forEach((item) => {
        item.default_address = false;
      });
    }
    if (
      !default_address &&
      user.addresses.filter((item) => item.default_address).length === 0
    ) {
      message = `There must be at least 1 default address so this address will be set as default`;
    }
    user.addresses.push({
      address,
      full_name,
      phone,
      default_address : default_address || user.addresses.filter((item) => item.default_address).length === 0,
    });
    user.modify.push({
      action: `Create address '${address}' by ${user.email}`,
      date: getNow(),
    });
    await user.save();
    return message ? res.status(201).json({ message }) : res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default createAddress;
