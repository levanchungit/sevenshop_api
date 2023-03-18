import { Request, Response } from "express";
import { IProductCart } from "interfaces/cart";
import Cart from "models/cart";
import { getIdFromReq } from "utils/token";

const addToCart = async (req: Request, res: Response) => {
  try {
    const id_user = getIdFromReq(req);
    // find cart of user
    const cart = await Cart.findOne({ user_id: id_user });
    const { product_id, quantity, size_id, color_id }: IProductCart = req.body;

    if (!cart) {
      // create new cart
      const newCart = new Cart({
        user_id: id_user,
        products: [
          {
            product_id,
            quantity,
            size_id,
            color_id,
          },
        ],
      });
      await newCart.save();
      return res.status(200).json(newCart);
    }

    // check if product is already in cart
    const productIndex = cart.products.findIndex(
      (product) =>
        product.product_id === product_id &&
        product.size_id === size_id &&
        product.color_id === color_id
    );
    if (productIndex !== -1) {
      // update quantity
      cart.products[productIndex].quantity += quantity;
    } else {
      // add new product
      cart.products.push({
        product_id,
        quantity,
        size_id,
        color_id,
      });
    }
    await cart.save();
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default addToCart;