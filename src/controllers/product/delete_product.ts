import { Request, Response } from "express";
import Product from "models/product";
import { isValidObjectId } from "mongoose";

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.sendStatus(400);
    if (!isValidObjectId(id)) return res.sendStatus(400);
    const product = await Product.findById(id);

    if (!product) return res.sendStatus(404);

    await Product.findByIdAndDelete(id);
    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default deleteProduct;
