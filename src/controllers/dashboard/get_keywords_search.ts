import { Request, Response } from "express";
import { ISearchProduct } from "interfaces/user";
import Category from "models/category";
import Notification from "models/notification";
import Order from "models/order";
import Product from "models/product";
import User from "models/user";
import Voucher from "models/voucher";

//get all history_search in User
const getHistorySearch = async (req: Request, res: Response) => {
  try {
    const sort = { created_at: -1 } as any;

    const historySearch = await User.find({})
      .select("history_search")
      .sort(sort);

    const history: ISearchProduct[] = [];
    historySearch.map((item) => {
      item.history_search.map((_item) => {
        history.push(_item);
      });
    });

    return res.status(200).json(history);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export default getHistorySearch;
