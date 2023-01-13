import { Request, Response } from "express";
import mongoose from "mongoose";
import Product, { ProductType } from "../../models/product";

const create = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      colors,
      sizes,
      images,
      categories,
      reviews,
    }: ProductType = req.body;
    const _id = new mongoose.Types.ObjectId();
    const product = new Product({
      _id,
      name,
      price,
      description,
      colors,
      sizes,
      images,
      categories,
      reviews,
    });
    const savedProduct = await product.save();
    if (savedProduct) {
      return res.status(201).json({ message: "Product created successfully" });
    } else {
      return res.status(500).json({ message: "Something went wrong" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
export default create;
