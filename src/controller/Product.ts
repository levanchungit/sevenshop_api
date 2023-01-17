import { Request, Response } from "express";
import mongoose from "mongoose";
import { FilterQuery } from "mongoose";
import Product, {
  ProductType,
  ProductTypeModel,
  ProductSort,
} from "../models/product";

export const create = async (req: Request, res: Response) => {
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

export const getProducts = async (req: Request, res: Response) => {
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
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const product = await Product.findById(_id, { __v: 0 });
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json(err);
  }
};
