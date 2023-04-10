import { Request, Response } from "express";
import { IProductsCart } from "interfaces/cart";
import Cart, { CartTypeModel } from "models/cart";
import Product from "models/product";
import User from "models/user";
import { isValidObjectId } from "mongoose";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

//delete product in cart
const deleteProductsCart = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    //req.body is array of IProductCart
    const { products }: IProductsCart = req.body;

    const validateFieldsResult = validateFields({ products }, [
      { name: "products", type: "arrayObject" },
    ]);
    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });

    const cart = await Cart.findOne({ user_id: user._id });

    if (!cart) return res.sendStatus(404);

    const newProducts = cart.products.filter((item) => {
      const { product_id, size_id, color_id } = item;
      const _product = products.find(
        (product) =>
          product.product_id == product_id &&
          product.size_id == size_id &&
          product.color_id == color_id
      );
      return !_product;
    });

    const productsDelete = cart.products.filter((item) => {
      return item.product_id && item.color_id && item.size_id;
    });

    cart.products = newProducts;
    cart.modify.push({
      action: `Delete products '${productsDelete}' in cart by ${user?.email}`,
      date: getNow(),
    });
    await cart.save();
    return res.sendStatus(200);

    // products.map(async (product) => {
    //   const { product_id, size_id, color_id } = product;

    //   if (product_id && !isValidObjectId(product_id))
    //     return res.status(400).json({ message: "Invalid product_id" });
    //   if (size_id && !isValidObjectId(size_id))
    //     return res.status(400).json({ message: "Invalid size_id" });
    //   if (color_id && !isValidObjectId(color_id))
    //     return res.status(400).json({ message: "Invalid color_id" });

    //   const cart = await Cart.findOne({ user_id: user._id });
    //   if (!cart) return res.sendStatus(404);
    //   const _product = cart.products.find(
    //     (item) =>
    //       item.product_id.toString() === product_id &&
    //       item.size_id.toString() === size_id &&
    //       item.color_id.toString() === color_id
    //   );
    //   if (!_product) return res.sendStatus(404);

    //   cart.products = cart.products.filter(
    //     (item) =>
    //       item.product_id.toString() !== product_id ||
    //       item.size_id.toString() !== size_id ||
    //       item.color_id.toString() !== color_id
    //   );
    //   cart.modify.push({
    //     action: `Delete product '${product_id}' color '${color_id}' size '${size_id}' in cart by ${user?.email}`,
    //     date: getNow(),
    //   });
    //   await cart.save();
    //   return res.sendStatus(200);
    // });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default deleteProductsCart;
