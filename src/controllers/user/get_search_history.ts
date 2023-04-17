import { Request, Response } from "express";
import User from "models/user";
import { getIdFromReq } from "utils/token";

const getSearchHistory = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;

    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    const sortedHistory = user.history_search.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    const results = {
      total: sortedHistory.length,
      page: page,
      limit: limit,
      results: sortedHistory.slice(startIndex, startIndex + limit),
    };

    return res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export default getSearchHistory;
