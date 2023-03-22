import { Request, Response } from "express";
import { IProductCart } from "interfaces/cart";
import { CartTypeModel } from "models/cart";
import Product from "models/product";
import { isValidObjectId } from "mongoose";
import { validateFields } from "utils/common";
import createCart from "./create_cart";

const addToCart = async (req: Request, res: Response) => {
  try {
    const cart = (await createCart(req, res)) as CartTypeModel;
    const { product_id, quantity, size_id, color_id }: IProductCart = req.body;
    if (!cart) return res.sendStatus(404);
    if (!product_id && !isValidObjectId(product_id))
      return res.status(400).json({ message: "Invalid product_id" });
    if (size_id && !isValidObjectId(size_id))
      return res.status(400).json({ message: "Invalid size_id" });
    if (color_id && !isValidObjectId(color_id))
      return res.status(400).json({ message: "Invalid color_id" });
    const validateFieldsResult = validateFields({ quantity }, [
      { name: "quantity", type: "number", required: true },
    ]);
    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });
    if (quantity <= 0)
      return res.status(400).json({ message: "Invalid quantity" });
    const product = await Product.findById(product_id);
    if (!product) return res.sendStatus(404);
    const { stock } = product;
    if (stock.length === 0) return res.sendStatus(404);
    const { size_ids, color_ids } = product;
    if (
      (size_id && !size_ids.includes(size_id)) ||
      (color_id && !color_ids.includes(color_id))
    )
      return res.sendStatus(404);
    const stockItem = stock.find((item) => {
      return (
        (!size_id || item.size_id?.toString() === size_id) &&
        (!color_id || item.color_id?.toString() === color_id)
      );
    });
    const productInCart = cart.products.find((item) => {
      return (
        item.product_id.toString() === product_id &&
        item.size_id?.toString() === size_id &&
        item.color_id?.toString() === color_id
      );
    });
    if (productInCart) {
      if (stockItem) {
        if (stockItem.quantity < productInCart.quantity + quantity)
          return res
            .status(400)
            .json({ message: "Quantity is not enough in stock" });
      }
      productInCart.quantity += quantity;
    } else {
      if (stockItem) {
        if (stockItem.quantity < quantity)
          return res
            .status(400)
            .json({ message: "Quantity is not enough in stock" });
      }
      cart.products.push({ product_id, quantity, size_id, color_id });
    }
    await cart.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default addToCart;
