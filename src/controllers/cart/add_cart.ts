import { Request, Response } from "express";
import { IProductCart } from "interfaces/cart";
import { CartTypeModel } from "models/cart";
import Product from "models/product";
import { validateFields } from "utils/common";
import createCart from "./create_cart";

const addToCart = async (req: Request, res: Response) => {
  try {
    const cart = (await createCart(req, res)) as CartTypeModel;
    const { product_id, quantity, size_id, color_id }: IProductCart = req.body;
    const validateFieldsResult = validateFields(
      { product_id, quantity, size_id, color_id },
      [
        { name: "product_id", type: "string", required: true },
        { name: "quantity", type: "number", required: true },
        { name: "size_id", type: "string" },
        { name: "color_id", type: "string" },
      ]
    );
    if (validateFieldsResult)
      return res.status(400).json({ message: validateFieldsResult });
    // check product quantity
    const product = await Product.findById(product_id);
    if (!product) return res.sendStatus(404);
    const { stock } = product;
    if (stock.length === 0) return res.sendStatus(404);
    const { size_ids, color_ids } = product;

    const stockItem = stock.find((item) => {
      return (
        (size_ids.length === 0 || size_ids.includes(item.size_id)) &&
        (color_ids.length === 0 || color_ids.includes(item.color_id))
      );
    });

    // check if product is already in cart
    const productInCart = cart.products.find((item) => {
      return (
        item.product_id.toString() === product_id &&
        (!size_id || item.size_id.toString() === size_id) &&
        (!color_id || item.color_id.toString() === color_id)
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
      cart.products.push({ product_id, quantity, size_id, color_id });
    }
    await cart.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default addToCart;
