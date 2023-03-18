import { getRoleFromReq, haveToken } from "utils/token";
import { Request, Response } from "express";
import { ROLE } from "constants/user";
import { STATUS_PRODUCT } from "constants/product";
import Product from "models/product";

const getProductById = async (req: Request, res: Response) => {
  try {
    const token = haveToken(req);
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.sendStatus(404);

    const product_for_user = {
      name: product.name,
      price: product.price,
      price_sale: product.price_sale,
      description: product.description,
      images: product.images,
    };

    if (token && getRoleFromReq(req) !== ROLE.admin && product.status === STATUS_PRODUCT.inactive) {
      return res.sendStatus(403);
    }
    
    return res.status(200).json(token && getRoleFromReq(req) === ROLE.admin ? product : product_for_user);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getProductById;
