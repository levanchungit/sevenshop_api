import { ProductSort } from "./../models/product/index";
import Product, { ProductTypeModel, ProductType } from "./../models/product";
import { NextFunction, Request, Response } from "express";
import mongoose, { FilterQuery } from "mongoose";

const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { offset, limit, title, category, color, price, sort } = req.query;

    const titleFilter = title ? { $text: { $search: title.toString() } } : {};
    const categoryFilter = category ? { category: category.toString() } : {};
    const colorFilter = color ? { colors: { $in: [color.toString()] } } : {};
    const priceFilter = price
      ? { price: { $lte: parseFloat(price.toString()) } }
      : {};

    const filter: FilterQuery<ProductTypeModel> = {
      ...titleFilter,
      ...categoryFilter,
      ...colorFilter,
      ...priceFilter,
    };

    let sortBy = {};
    switch (sort?.toString()) {
      case ProductSort.price_des:
        sortBy = { price: -1 };
        break;
      case ProductSort.price_asc:
        sortBy = { price: 1 };
        break;
      case ProductSort.name_des:
        sortBy = { name: -1 };
        break;
      case ProductSort.name_asc:
        sortBy = { title: 1 };
        break;
      default:
        sortBy = {};
        break;
    }

    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(parseInt(offset?.toString() ?? "0"))
      .limit(parseInt(limit?.toString() ?? "0"));
    return res.status(200).json({ error: false, products });
  } catch (err) {
    return res.status(500).json({ error: true, message: err });
  }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.params.id;
    const product = await Product.findById(_id);
    if (product) {
      return res.status(200).json({ error: false, product });
    } else {
      return res
        .status(404)
        .json({ errror: true, message: "Product not found" });
    }
  } catch (err) {
    return res.status(500).json({ errror: true, message: err });
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      price,
      description,
      colors,
      size,
      image,
      category,
      review,
    }: ProductType = req.body;
    const _id = new mongoose.Types.ObjectId();
    const product = new Product({
      _id,
      name,
      price,
      description,
      colors,
      size,
      image,
      category,
      review,
    });
    const savedProduct = await product.save();
    if (savedProduct) {
      return res.status(201).json({ error: false, data: product });
    } else {
      return res
        .status(500)
        .json({ error: false, message: "Faild to create new product" });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: error.message });
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const {
      name,
      price,
      description,
      colors,
      size,
      image,
      category,
      review,
    }: ProductType = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { _id },
      {
        $set: {
          name,
          price,
          description,
          colors,
          size,
          image,
          category,
          review,
        },
      },
      { new: true }
    );
    return res.status(200).json({ error: false, data: updatedProduct });
  } catch (err) {
    return res.status(500).json({ error: true, message: err });
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const _id = req.params.id;
    const deletedProduct = await Product.deleteOne({ _id });

    return res.status(200).json({ error: false, success: true });
  } catch (err) {
    return res.status(500).json({ error: true, message: err });
  }
};

export default {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
