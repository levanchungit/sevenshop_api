import { Request, Response } from "express";
import User, { IUser } from "models/user";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const updateSelfUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    const { full_name, phone, birthday } = req.body;

    const validateFieldsResult = validateFields(
      { full_name, phone, birthday },
      [
        { name: "full_name", type: "string", required: true },
        { name: "phone", type: "string", required: true },
        { name: "birthday", type: "string", required: true },
      ]
    );
    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });

    user.full_name = full_name;
    user.phone = phone;
    user.birthday = birthday;

    user.modify.push({
      action: `Update user '${user.full_name}' by ${user.email}`,
      date: getNow(),
    });

    await user.save();
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
};

export default updateSelfUser;
