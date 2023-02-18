import User from "models/user";
import { getIdFromReq } from "./../utils/token";
import { Request, Response } from "express";
import { FilterQuery } from "mongoose";
import Product, { ProductType, ProductTypeModel } from "models/product";
import moment from "moment";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      images,
      properties_type,
      categories_type,
    }: ProductType = req.body;
    const id = getIdFromReq(req);
    const user = await User.findById(id);
    const product = new Product({
      name,
      price,
      description,
      images,
      properties_type,
      categories_type,
    });
    product.create_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
    product.create_by =
      user?.email +
      "_CREATE_" +
      moment(new Date()).format("YYYY-MM-DD HH:mm") +
      " | ";
    const savedProduct = await product.save();
    if (savedProduct) {
      return res.status(200).json(savedProduct);
    } else {
      return res.status(500).json({ message: "Faild to create new product" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const {
      name,
      price,
      description,
      images,
      properties_type,
      categories_type,
    }: ProductType = req.body;
    const id = getIdFromReq(req);
    const user = await User.findById(id);
    const updateProduct = await Product.findOneAndUpdate(
      { _id },
      {
        $set: {
          name,
          price,
          description,
          images,
          properties_type,
          categories_type,
          modify_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
          modify_by:
            user?.email +
            "_UPDATE _" +
            moment(new Date()).format("YYYY-MM-DD HH:mm") +
            " | ",
        },
      },
      { new: true }
    );
    console.log(updateProduct);
    return res.status(200).json(updateProduct);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const deleteProduct = await Product.deleteOne({ _id });
    console.log(deleteProduct);
    if (deleteProduct) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const anActiveProduct = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const anActiveProduct = await Product.findOneAndUpdate(
      { _id },
      {
        $set: {
          active: false,
        },
      }
    );
    if (anActiveProduct) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query;

    const products = await Product.find({ active: true })
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
