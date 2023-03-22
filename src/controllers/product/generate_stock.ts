import { Request, Response } from "express";
import Product from "models/product";

const generateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.sendStatus(404);
    const { size_ids, color_ids } = product;
    if (size_ids.length === 0 && color_ids.length === 0)
      return res.sendStatus(400);
    const stock = product.stock;
    if (size_ids.length === 0) {
      color_ids.forEach((color_id) => {
        const isExist = stock.find(
          (item) => item.color_id?.toString() === color_id.toString()
        );
        if (!isExist) {
          stock.push({
            color_id,
            quantity: 0,
          });
        }
      });
    } else if (color_ids.length === 0) {
      size_ids.forEach((size_id) => {
        const isExist = stock.find(
          (item) => item.size_id?.toString() === size_id.toString()
        );
        if (!isExist) {
          stock.push({
            size_id,
            quantity: 0,
          });
        }
      });
    } else {
      size_ids.forEach((size_id) => {
        color_ids.forEach((color_id) => {
          const isExist = stock.find(
            (item) =>
              item.size_id?.toString() === size_id.toString() &&
              item.color_id?.toString() === color_id.toString()
          );
          if (!isExist) {
            stock.push({
              size_id,
              color_id,
              quantity: 0,
            });
          }
        });
      });
    }
    await Product.findByIdAndUpdate(id, { stock });
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default generateStock;
