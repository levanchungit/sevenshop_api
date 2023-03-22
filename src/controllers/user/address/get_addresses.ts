import { Request, Response } from "express";
import User from "models/user";
import { getIdFromReq } from "utils/token";

const getAddresses = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const total = user.addresses.length;
    const addresses = user.addresses.sort((a, b) => {
      if (a.default_address && !b.default_address) return -1;
      if (!a.default_address && b.default_address) return 1;
      return 0;
    });

    const results = {
      total: total,
      results: addresses,
    };

    return res.json(results);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getAddresses;
