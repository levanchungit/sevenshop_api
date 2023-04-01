import { CartTypeModel } from "models/cart";
import { Request, Response } from "express";
import Product from "models/product";
import createCart from "./create_cart";
import { IProductCart } from "interfaces/cart";

//get total price of cart
const getTotalCart = async (req: Request, res: Response) => {
  try {
    const { products } = req.body;

    if (products.length === 0) return res.status(200).json(0);

    //sum price of all products in cart
    let total = 0;
    for (let i = 0; i < products.length; i++) {
      const { quantity, price, price_sale } = products[i];
      total += (price_sale || price) * quantity;
    }
    res.status(200).json({ total });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getTotalCart;
