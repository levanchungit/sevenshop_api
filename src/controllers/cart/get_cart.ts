import { CartTypeModel } from "models/cart";
import { Request, Response } from "express";
import Product from "models/product";
import createCart from "./create_cart";
import Color from "models/color";
import Size from "models/size";

const get_cart = async (req: Request, res: Response) => {
  try {
    const cart = (await createCart(req, res)) as CartTypeModel;
    const { products } = cart;
    if (products.length === 0) return res.status(200).json([]);
    const cart_products = products.map(async (product) => {
      const { product_id, quantity, size_id, color_id } = product;
      const itemProduct = await Product.findById(product_id);
      if (!itemProduct) return res.sendStatus(404);
      const { name, price, price_sale, images } = itemProduct;

      //get color name by color_id, size name by size_id
      const color = await Color.findById(color_id).select("name");
      const size = await Size.findById(size_id).select("size");
      return {
        product_id,
        quantity,
        color,
        size,
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
