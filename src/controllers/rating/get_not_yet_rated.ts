import { STATUS_ORDER } from "../../constants/order";
import { Request, Response } from "express";
import Order from "models/order";
import Product, { IProduct } from "models/product";
import { getIdFromReq } from "utils/token";
import { IRatingResult } from "interfaces/rating";
import Size from "models/size";
import Color from "models/color";
import Rating from "models/rating";

//get all ratings of a product by product id and user id
const getNotYetRated = async (req: Request, res: Response) => {
  const user_id = getIdFromReq(req);

  const ratings: IRatingResult[] = [];
  const orders = await Order.find({ user_id, status: STATUS_ORDER.completed });
  if (!orders) return res.status(400).json({ ratings });

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const products = order.products;
    for (let j = 0; j < products.length; j++) {
      const product = products[j];
      const _product = await Product.findById(product.product_id);
      const _size = await Size.findById(product.size_id);
      const _color = await Color.findById(product.color_id);
      if (!_product || !_size || !_color)
        return res.status(400).json({ ratings });

      const rating = ratings.find((rating) => {
        return (
          rating.product_id.toString() === _product?._id.toString() &&
          rating.color_id.toString() === _color?._id.toString() &&
          rating.size_id.toString() === _size?._id.toString()
        );
      });
      if (rating) continue;

      //check if rating exists in database
      const _rating = await Rating.findOne({
        ratings: {
          $elemMatch: {
            product_id: _product?._id,
            color_id: _color?._id,
            size_id: _size?._id,
          },
        },
      });
      if (_rating) continue;

      const obj: IRatingResult = {
        product_id: _product?._id,
        product_name: _product?.name,
        product_image: _product?.images[0],
        size_id: _size?._id,
        size_name: _size?.name,
        color_id: _color?._id,
        color_name: _color?.name,
        quantity: product.quantity,
      };
      ratings.push(obj);
    }
  }

  return res.status(200).json({ results: ratings });
};

export default getNotYetRated;
