import { getRoleFromReq, haveToken } from "utils/token";
import { Request, Response } from "express";
import { ROLE } from "constants/user";
import { STATUS_PRODUCT } from "constants/product";
import Product from "models/product";
import Color from "models/color";
import Size from "models/size";

const getProductById = async (req: Request, res: Response) => {
  try {
    const token = haveToken(req);
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.sendStatus(404);

    const stock = product.stock.map(async (item) => {
      //get color name by color_id, size name by size_id
      const color = await Color.findById(item.color_id);
      const size = await Size.findById(item.size_id);

      if (!color || !size) return res.sendStatus(500);

      return {
        ...item,
        color_name: color.name,
        size_name: size.name,
      };
    });

    return res.status(200).json(token && product);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getProductById;
