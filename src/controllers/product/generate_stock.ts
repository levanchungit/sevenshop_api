import { Request, Response } from "express";
import Product from "models/product";

const generateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.sendStatus(404);
    const { size_ids, color_ids } = product;
    const stock = product.stock;
    if (size_ids.length === 0) {
      stock.forEach((item) => {
        if (color_ids.includes(item.color_id)) item.quantity = 0;
      });
    } else if (color_ids.length === 0) {
      stock.forEach((item) => {
        if (size_ids.includes(item.size_id)) item.quantity = 0;
      });
    } else {
      stock.forEach((item) => {
        if (
          size_ids.includes(item.size_id) &&
          color_ids.includes(item.color_id)
        )
          item.quantity = 0;
      });
    }
    await product.updateOne({ stock });
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default generateStock;
