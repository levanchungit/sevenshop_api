import { Request, Response } from "express";
import { IProductCart } from "interfaces/cart";
import Cart from "models/cart";
import Product from "models/product";
import User from "models/user";
import { isValidObjectId } from "mongoose";
import { getNow, validateFields } from "utils/common";
import { getIdFromReq } from "utils/token";

const changeSizeColor = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) return res.sendStatus(403);

    const { product_id, size_id, color_id } = req.query;
    const { _size_id, _color_id, _quantity } = req.body;
    if (!product_id && !isValidObjectId(product_id)) {
      return res.status(400).json({ message: "Invalid product_id" });
    }
    if (size_id && !isValidObjectId(size_id)) {
      return res.status(400).json({ message: "Invalid size_id" });
    }
    if (color_id && !isValidObjectId(color_id)) {
      return res.status(400).json({ message: "Invalid color_id" });
    }

    const cart = await Cart.findOne({ user_id: user._id });
    if (!cart) {
      return res.sendStatus(404);
    }

    for (let i = 0; i < cart.products.length; i++) {
      if (
        cart.products[i].product_id.toString() == product_id &&
        cart.products[i].size_id?.toString() == size_id &&
        cart.products[i].color_id?.toString() == color_id
      ) {
        //check quantity > quantity in Product.stock error message
        const product = await Product.findById(cart.products[i].product_id);
        if (!product) return res.sendStatus(404);

        const { stock } = product;

        const productInCart = cart.products.find((item) => {
          return (
            item.product_id.toString() === product_id &&
            item.size_id?.toString() === size_id &&
            item.color_id?.toString() === color_id
          );
        });

        const stockItem = stock.find((item) => {
          return (
            (!size_id || item.size_id?.toString() === size_id) &&
            (!color_id || item.color_id?.toString() === color_id)
          );
        });

        if (productInCart) {
          if (stockItem) {
            if (stockItem.quantity < _quantity)
              return res
                .status(400)
                .json({ message: "Quantity is not enough in stock" });
          }
          productInCart.quantity = _quantity;
        } else {
          if (stockItem) {
            if (stockItem.quantity < _quantity)
              return res
                .status(400)
                .json({ message: "Quantity is not enough in stock" });
          }
        }

        //change size and color
        cart.products[i].size_id = _size_id;
        cart.products[i].color_id = _color_id;
        cart.products[i].quantity = _quantity;

        cart.modify.push({
          action: `Change size '${size_id} and color '${color_id}' of product '${product_id}' by ${user.email}`,
          date: getNow(),
        });
        await cart.save();
      }
    }
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
};

export default changeSizeColor;
