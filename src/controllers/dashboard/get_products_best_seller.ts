import { Request, Response } from "express";
import { ISearchProduct } from "interfaces/user";
import Category from "models/category";
import Notification from "models/notification";
import Order from "models/order";
import Product from "models/product";
import User from "models/user";
import Voucher from "models/voucher";

//get product best seller
const getProductsBestSeller = async (req: Request, res: Response) => {
  const bestSellers = await Order.aggregate([
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: "$product._id",
        product_name: { $first: "$product.name" },
        price: { $first: "$product.price" },
        price_sale: { $first: "$product.price_sale" },
        image: { $first: "$product.images" },
        sold_quantity: { $sum: "$products.quantity" },
        total_revenue: { $sum: "$total_price" },
      },
    },
    {
      $lookup: {
        from: "users",
        let: { product_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$product_id", "$recently_products"],
              },
            },
          },
          {
            $group: {
              _id: "$$product_id",
              views: { $sum: 1 },
            },
          },
        ],
        as: "product_recently_views",
      },
    },
    {
      $lookup: {
        from: "users",
        let: { product_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$product_id", "$favorite_products"],
              },
            },
          },
          {
            $group: {
              _id: "$$product_id",
              favorites: { $sum: 1 },
            },
          },
        ],
        as: "product_favorites",
      },
    },
    {
      $sort: {
        sold_quantity: -1,
      },
    },
    {
      $project: {
        _id: 1,
        product_name: 1,
        price: 1,
        price_sale: 1,
        image: { $arrayElemAt: ["$image", 0] },
        sold_quantity: 1,
        total_revenue: 1,
        views: {
          $ifNull: [{ $arrayElemAt: ["$product_recently_views.views", 0] }, 0],
        },
        favorites: {
          $ifNull: [{ $arrayElemAt: ["$product_favorites.favorites", 0] }, 0],
        },
      },
    },
    {
      $limit: 10,
    },
  ]);
  return res.status(200).json(bestSellers);
};

export default getProductsBestSeller;
