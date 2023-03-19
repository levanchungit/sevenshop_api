import { Request, Response } from "express";
import Cart from "models/cart";
import Product from "models/product";
import { getNow } from "utils/common";
import { getIdFromReq } from "utils/token";

const get_cart = async (req: Request, res: Response) => {
  try {
    const user_id = getIdFromReq(req);
    // find cart of user
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      // create new cart
      const newCart = new Cart({
        user_id,
        products: [],
        created_at: getNow(),
        created_by: "system",
      });
      await newCart.save();
      return res.status(200).json(newCart.products);
    }
    const { products } = cart;
    const cart_products = products.map(async (product) => {
      const { product_id, quantity, size_id, color_id } = product;
      const itemProduct = await Product.findById(product_id);
      if (!itemProduct) return res.sendStatus(404);
      const { name, price, price_sale, images } = itemProduct;
      return {
        product_id,
        quantity,
        size_id,
        color_id,
        name,
        price,
        price_sale,
        images,
      };
    });
    return res.status(200).json(await Promise.all(cart_products));
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default get_cart;
