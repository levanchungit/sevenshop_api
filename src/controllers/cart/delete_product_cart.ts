import { Request, Response } from "express";
import { IProductCart } from "interfaces/cart";
import Cart, { CartTypeModel } from "models/cart";
import Product from "models/product";
import User from "models/user";
import { isValidObjectId } from "mongoose";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";
import createCart from "./create_cart";

//delete product in cart
const deleteProductCart = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);
    const { product_id, size_id, color_id } = req.body;
    if (product_id && !isValidObjectId(product_id))
      return res.status(400).json({ message: "Invalid product_id" });
    if (size_id && !isValidObjectId(size_id))
      return res.status(400).json({ message: "Invalid size_id" });
    if (color_id && !isValidObjectId(color_id))
      return res.status(400).json({ message: "Invalid color_id" });

    const cart = await Cart.findOne({ user_id: user._id });
    if (!cart) return res.sendStatus(404);
    const product = cart.products.find(
      (item) =>
        item.product_id.toString() === product_id &&
        item.size_id.toString() === size_id &&
        item.color_id.toString() === color_id
    );
    if (!product) return res.sendStatus(404);

    cart.products = cart.products.filter(
      (item) =>
        item.product_id.toString() !== product_id ||
        item.size_id.toString() !== size_id ||
        item.color_id.toString() !== color_id
    );
    cart.modify.push({
      action: `Delete product '${product_id}' color '${color_id}' size '${size_id}' in cart by ${user?.email}`,
      date: getNow(),
    });
    await cart.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default deleteProductCart;
