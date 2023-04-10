import { Request, Response } from "express";
import { ISearchProduct } from "interfaces/user";
import User, { IUser } from "models/user";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const addSearchHistory = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;
    const user = await User.findById(getIdFromReq(req));

    const validateFieldsResult = validateFields({ keyword }, [
      { name: "keyword", type: "string", required: true },
    ]);

    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });

    if (!user) return res.sendStatus(403);

    const search: ISearchProduct = {
      keyword,
      created_at: getNow(),
    };

    //check keyword exist
    const index = user?.history_search.findIndex(
      (item) => item.keyword === keyword
    );
    if (index !== -1) {
      user?.history_search.splice(index, 1);
    }

    user?.history_search.push(search);
    user.modify.push({
      action: `Add keyword search '${keyword}' by ${user.email}`,
      date: getNow(),
    });
    await user?.save();

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export default addSearchHistory;
