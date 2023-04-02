import { Request, Response } from "express";
import { ISearchProduct } from "interfaces/user";
import User, { IUser } from "models/user";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const getSearchHistory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "created_at";
    const startIndex = (page - 1) * limit;

    const user = await User.findById(getIdFromReq(req))
      .sort(sort)
      .limit(limit)
      .skip(startIndex);
    if (!user) return res.sendStatus(403);

    const results = {
      total: user.history_search.length,
      page: page,
      limit: limit,
      results: user.history_search,
    };

    return res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export default getSearchHistory;
