import { Request, Response } from "express";
import { IAddress } from "interfaces/user";
import User from "models/user";
import { isValidObjectId } from "mongoose";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const updateAddress = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const { address, full_name, phone, default_address }: IAddress = req.body;
    const { id } = req.params;
    if (!id) return res.sendStatus(400);
    if (!isValidObjectId(id)) return res.sendStatus(400);
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
    const addressIndex = user.addresses.findIndex(
      (item) => item._id?.toString() === id
    );
    if (addressIndex === -1) return res.sendStatus(404);
    if (default_address) {
      user.addresses.forEach((item) => {
        if (item._id?.toString() !== id) item.default_address = false;
      });
    } else {
      //find address by id and check if it is default address
      const address = user.addresses.find(
        (item) => item._id?.toString() === id
      );
      if (address?.default_address) {
        const message = `Address '${address.address}' by '${address.full_name}' is default address. Can not update default_address to false`;
        return res.status(409).json({ message });
      }
      // //check if there is at least 1 default address
      // if (user.addresses.filter((item) => item.default_address).length === 1) {
      //   const message = `There must be at least 1 default address`;
      //   return res.status(409).json({ message });
      // }
    }
    if (
      user.addresses[addressIndex].address === address &&
      user.addresses[addressIndex].full_name === full_name &&
      user.addresses[addressIndex].phone === phone &&
      user.addresses[addressIndex].default_address === default_address
    ) {
      return res.sendStatus(304);
    }
    const existingAddress = user.addresses.find(
      (item) => item.address === address && item.phone === phone
    );
    if (existingAddress && existingAddress._id?.toString() !== id) {
      const message = `Address '${address}' by ${full_name} already exists`;
      return res.status(409).json({ message });
    }

    user.addresses[addressIndex].address = address;
    user.addresses[addressIndex].full_name = full_name;
    user.addresses[addressIndex].phone = phone;
    user.addresses[addressIndex].default_address = default_address;
    user.modify.push({
      action: `Update address '${address}' by ${user.email}`,
      date: getNow(),
    });
    await user.updateOne(user);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export default updateAddress;
