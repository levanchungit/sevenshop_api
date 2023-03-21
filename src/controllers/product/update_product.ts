import { Request, Response } from "express";
import Log from "libraries/log";
import Category from "models/category";
import Color from "models/color";
import Product, { IProduct } from "models/product";
import Size from "models/size";
import User from "models/user";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const updateProduct = async (req: Request, res: Response) => {
  try {
    const id_user = getIdFromReq(req);
    const { id } = req.params;
    const user = await User.findById(id_user);
    const {
      name,
      price,
      price_sale,
      description,
      images,
      category_ids,
      color_ids,
      size_ids,
      status,
      stock,
    }: IProduct = req.body;
    const product = await Product.findById(id);

    if (!product) return res.sendStatus(404);
    if (!user) return res.sendStatus(403);

    const validateFieldsResult = validateFields(
      {
        name,
        price,
        price_sale,
        description,
        images,
        category_ids,
        color_ids,
        size_ids,
        status,
        stock,
      },
      [
        { name: "name", type: "string", required: true },
        { name: "price", type: "number", required: true },
        { name: "price_sale", type: "number" },
        { name: "description", type: "string", required: true },
        { name: "images", type: "arrayString" },
        { name: "category_ids", type: "arrayString", required: true },
        { name: "color_ids", type: "arrayString", required: true },
        { name: "size_ids", type: "arrayString", required: true },
        { name: "status", type: "string" },
        { name: "stock", type: "arrayObject" },
      ]
    );
    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });

    // check if color_ids, size_ids, category_ids are valid
    const colors = await Color.find({ _id: { $in: color_ids } });
    if (colors.length !== color_ids.length)
      return res.status(400).json({ message: "Invalid color_ids" });
    const sizes = await Size.find({ _id: { $in: size_ids } });
    if (sizes.length !== size_ids.length)
      return res.status(400).json({ message: "Invalid size_ids" });
    const categories = await Category.find({ _id: { $in: category_ids } });
    if (categories.length !== category_ids.length)
      return res.status(400).json({ message: "Invalid category_ids" });

    if (stock) {
      for (const item of stock) {
        if ((!item.color_id && !item.size_id) || item.quantity === undefined) {
          return res.status(400).json({ message: "Invalid stock" });
        }
        if (item.color_id) {
          const color = colors.find(
            (color) => color._id.toString() === item.color_id
          );
          if (!color)
            return res
              .status(400)
              .json({ message: `Invalid stock, color: ${item.color_id}` });
        }
        if (item.size_id) {
          const size = sizes.find(
            (size) => size._id.toString() === item.size_id
          );
          if (!size)
            return res
              .status(400)
              .json({ message: `Invalid stock, size: ${item.size_id}` });
        }
      }
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct && existingProduct._id.toString() !== id) {
      return res
        .status(409)
        .json({ message: "Product with this name already exists" });
    }

    const fieldsEdited = [];
    if (name && name !== product.name) fieldsEdited.push("name");
    if (price && price !== product.price) fieldsEdited.push("price");
    if (price_sale && price_sale !== product.price_sale)
      fieldsEdited.push("price_sale");
    if (description && description !== product.description)
      fieldsEdited.push("description");
    if (images && images !== product.images) fieldsEdited.push("images");
    if (JSON.stringify(category_ids) !== JSON.stringify(product.category_ids))
      fieldsEdited.push("category_ids");
    if (JSON.stringify(color_ids) !== JSON.stringify(product.color_ids))
      fieldsEdited.push("color_ids");
    if (JSON.stringify(size_ids) !== JSON.stringify(product.size_ids))
      fieldsEdited.push("size_ids");
    if (status && status !== product.status) fieldsEdited.push("status");
    if (
      stock &&
      JSON.stringify(stock, (key, value) =>
        key === "_id" ? undefined : value
      ) !==
        JSON.stringify(product.stock, (key, value) =>
          key === "_id" ? undefined : value
        )
    ) {
      fieldsEdited.push("stock");
    }

    if (!fieldsEdited.length) return res.sendStatus(304);

    const newProduct: IProduct = {
      ...product.toObject(),
      name: name ?? product.name,
      price: price ?? product.price,
      price_sale: price_sale ?? product.price_sale,
      description: description ?? product.description,
      images: images ?? product.images,
      category_ids: category_ids ?? product.category_ids,
      color_ids: color_ids ?? product.color_ids,
      size_ids: size_ids ?? product.size_ids,
      status: status ?? product.status,
      stock: stock ?? product.stock,
      modify: [
        ...product.modify,
        {
          action: `Update fields: ${fieldsEdited.join(", ")} by ${user.email}`,
          date: getNow(),
        },
      ],
    };

    await product.set(newProduct).save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default updateProduct;
