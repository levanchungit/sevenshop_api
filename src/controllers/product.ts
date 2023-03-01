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
      price_sale,
      description,
      images,
      active,
      properties_type,
      categories_type,
    }: IProduct = req.body;
    const id = getIdFromReq(req);

    const user = await User.findById(id);

    if (Number(price) < Number(price_sale)) {
      res
        .status(500)
        .json({ message: "Discount price must be lower than price" });
    }

    var imageUrlList: any[] = [];

    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((obj: any) => {
          imageUrlList.push(obj.path);
        });
      }
    }

    let _storage_quantity: number = 0;

    if (properties_type) {
      for (let i = 0; i < properties_type.length; i++) {
        _storage_quantity += Number(properties_type[i].quantity);
      }
    }

    const product = new Product({
      name,
      price,
      price_sale,
      description,
      images: imageUrlList,
      active,
      storage_quantity: _storage_quantity,
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
      price_sale,
      description,
      images,
      active,
      storage_quantity,
      properties_type,
      categories_type,
    }: IProduct = req.body;

    const idUser = getIdFromReq(req);
    const user = await User.findById(idUser);

    if (Number(price) < Number(price_sale)) {
      res
        .status(500)
        .json({ message: "Discount price must be lower than price" });
    }

    var imageUrlList: any[] = [];
    if (req.files) {
      if (Array.isArray(req.files)) {
        req.files.forEach((obj: any) => {
          imageUrlList.push(obj.path);
        });
      }
    }

    let _storage_quantity: number = 0;

    if (properties_type) {
      for (let i = 0; i < properties_type.length; i++) {
        _storage_quantity += Number(properties_type[i].quantity);
      }
    }

    const updateProduct = await Product.findOneAndUpdate(
      { _id },
      {
        $set: {
          name,
          price,
          price_sale,
          description,
          images: imageUrlList,
          active,
          storage_quantity: _storage_quantity,
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

    const products = await Product.find({})
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
        price_sale: products[i].price_sale,
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
      .json({ message: "Get Products Successfully", result: products });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getProductByID = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const product = await Product.findById(_id, { __v: 0 });
    if (!product) {
      return res.status(500).json({ message: "Product not found" });
    }
    return res
      .status(200)
      .json({ message: "Get Product By ID Successfully", result: product });
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

export const addProductFavorites = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const idUser = getIdFromReq(req);
    const product = await Product.findById({ _id });
    if (!product) {
      res.status(500).json({ message: "Product not found" });
    }
    const user = await User.findOneAndUpdate(
      { _id: idUser },
      {
        $addToSet: {
          product_favorites: _id,
        },
      },
      {
        new: true,
      }
    );
    if (user) {
      res.status(201).json({ message: "Add Product Favorites Updated" });
    } else {
      res.status(500).json({ message: "Add Product Favorites Failed" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const removeProductFavorites = async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    const idUser = getIdFromReq(req);

    const product = await Product.findById({ _id });
    if (!product) {
      res.status(500).json({ message: "Product not found" });
    }
    const user = await User.findOneAndUpdate(
      { _id: idUser },
      {
        $pull: {
          product_favorites: _id,
        },
      }
    );
    if (user) {
      res.status(201).json({ message: "Remove Product Favorites Updated" });
    } else {
      res.status(500).json({ message: "Remove Product Favorites Failed" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const getProductsRecent = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query;
    const idUser = getIdFromReq(req);
    const products_id = (await User.findOne({ _id: idUser }))?.recent_products;

    const _products = await Product.find({
      _id: {
        $in: products_id,
      },
    });

    //get product by categories
    const arrCategories = [];
    for (let i = 0; i < _products.length; i++) {
      arrCategories.push(_products[i].categories_type);
    }

    let products = [];

    //arrCategories recent null
    if (arrCategories.length == 0) {
      products = await Product.find({})
        .skip(parseInt(offset?.toString() ?? "0"))
        .limit(parseInt(limit?.toString() ?? "0"));
    } else {
      products = await Product.find({
        categories_type: {
          $in: arrCategories,
        },
      })
        .skip(parseInt(offset?.toString() ?? "0"))
        .limit(parseInt(limit?.toString() ?? "0"));
    }

    res.status(200).json({
      message: "Get Products Recent Successfully",
      result: products,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getProductsSale = async (req: Request, res: Response) => {
  try {
    const { offset, limit } = req.query;
    const products = await Product.find({
      price_sale: { $gt: 0 },
    })
      .skip(parseInt(offset?.toString() ?? "0"))
      .limit(parseInt(limit?.toString() ?? "0"));

    res.status(200).json({
      message: "Get Products Sale Successfully",
      result: products,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};
