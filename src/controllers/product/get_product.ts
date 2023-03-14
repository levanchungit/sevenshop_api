import { getRoleFromReq, haveToken } from "utils/token";
import { Request, Response } from "express";
import { ROLE } from "constants/user";
import { STATUS_PRODUCT } from "constants/product";
import Product, { IProduct } from "models/product";

const getProductById = async (req: Request, res: Response) => {
  try {
    const token = haveToken(req);
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.sendStatus(404);
    }
    // user is logged in
    if (token) {
      const role = getRoleFromReq(req);
      if (role !== ROLE.admin) {
        if (product.status !== STATUS_PRODUCT.inactive) {
          return res.status(200).json({});
        }
      }
      return res.status(200).json(product);
    } else {
      // user is not logged in
      if (product.status !== STATUS_PRODUCT.inactive) {
        return res.status(200).json({});
      }
    }
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getProductById;
