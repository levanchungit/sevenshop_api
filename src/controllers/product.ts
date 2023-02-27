import MetaDataDetail from "models/meta_data_detail";
import { IProduct } from "./../models/product";
import User from "models/user";
import { getIdFromReq } from "./../utils/token";
import { Request, Response } from "express";
import Product from "models/product";
import moment from "moment";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      images,
      active,
      storage_quantity,
      properties_type,
      categories_type,
    }: IProduct = req.body;
    const id = getIdFromReq(req);

    const user = await User.findById(id);
    var imageUrlList: any[] = [];

    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((obj: any) => {
          imageUrlList.push(obj.path);
        });
      }
    }

    const product = new Product({
      name,
      price,
      description,
      images: imageUrlList,
      active,
      storage_quantity,
      properties_type,
      categories_type,
      create_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
      create_by:
        user?.email + "_INS_" + moment(new Date()).format("YYYY-MM-DD HH:mm"),
    });
    const savedProduct = await product.save();
    if (savedProduct) {
      return res
        .status(201)
        .json({ message: "Created successfully", result: savedProduct });
    } else {
      return res.status(500).json({ message: "Fail create new product" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
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
      active,
      storage_quantity,
      properties_type,
      categories_type,
    }: IProduct = req.body;

    const idUser = getIdFromReq(req);
    const user = await User.findById(idUser);

    var imageUrlList: any[] = [];
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((obj: any) => {
          imageUrlList.push(obj.path);
        });
      }
    }

    const updateProduct = await Product.findOneAndUpdate(
      { _id },
      {
        $set: {
          name,
          price,
          description,
          images: imageUrlList,
          active,
          storage_quantity,
          properties_type,
          categories_type,
          modify_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
          modify_by:
            user?.email +
            "_UPD_" +
            moment(new Date()).format("YYYY-MM-DD HH:mm") +
            " | ",
        },
      },
      { new: true }
    );

    if (updateProduct) {
      return res
        .status(200)
        .json({ message: "Update successfully", result: updateProduct });
    } else {
      return res.status(500).json({ message: "Update failed" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const deleteProduct = await Product.deleteOne({ _id });
    if (deleteProduct.deletedCount != 0) {
      return res.status(200).json({ mesage: "Delete Successfully" });
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
      return res
        .status(200)
        .json({ message: "An Active Product Successfully" });
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

    const _products = [];

    for (let i = 0; i < products.length; i++) {
      const product_properties = [];

      for (let j = 0; j < products[i].properties_type.length; j++) {
        //get Color
        const color_id = products[i].properties_type[j].color_id;
        const objColor = await MetaDataDetail.findOne({ _id: color_id });

        //get Size
        const size_id = products[i].properties_type[j].size_id;
        const objSize = await MetaDataDetail.findOne({ _id: size_id });

        const objProperties = {
          color_id: objColor?._id,
          color_name: objColor?.code_name,
          color_code: objColor?.num1,
          size_id: objSize?._id,
          size_name: objSize?.code_name,
        };
        product_properties.push(objProperties);
      }

      const product = {
        _id: products[i]._id,
        name: products[i].name,
        price: products[i].price,
        description: products[i].description,
        images: products[i].images,
        active: products[i].active,
        storage_quantity: products[i].storage_quantity,
        properties_type: product_properties,
        categories_type: products[i].categories_type,
        create_at: products[i].create_at,
        create_by: products[i].create_by,
        modify_at: products[i].modify_at,
        modify_by: products[i].modify_by,
      };

      _products.push(product);
    }

    return res
      .status(200)
      .json({ message: "Get Products Successfully", result: _products });
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

export const recentProduct = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const idUser = getIdFromReq(req);
    const user = await User.findOneAndUpdate(
      { _id: idUser },
      {
        $addToSet: {
          recent_products: _id,
        },
      }
    );
    if (user) {
      res.status(201).json({ message: "Recent product updated" });
    } else {
      res.status(500).json({ message: "Recent product exists" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const productFavorites = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const idUser = getIdFromReq(req);
    const user = await User.findOneAndUpdate(
      { _id: idUser },
      {
        $addToSet: {
          product_favorites: _id,
        },
      }
    );
    if (user) {
      res.status(201).json({ message: "Product favorites updated" });
    } else {
      res.status(500).json({ message: "Product favorites exists" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
