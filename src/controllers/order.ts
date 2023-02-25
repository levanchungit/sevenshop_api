import Product from "models/product";
import Order, {
  IOrder,
  PaymentType,
  ProductType,
  Status,
} from "./../models/order";
import moment from "moment";
import { Request, Response } from "express";
import User from "models/user";
import { getIdFromReq, parseJwt, tokenGen } from "utils/token";
import { Stats } from "fs";

export const getAll = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ message: "Get Order Successfully", result: orders });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { code, product_id, color, size, quantity, image } = req.body;
    const idUser = getIdFromReq(req);
    const user = await User.findById(idUser);
    const product = await Product.findById(product_id);

    if (!product) {
      res.status(500).json({ message: "Product not found" });
    }

    if (quantity > Number(product?.storage_quantity)) {
      return res.status(500).json({ message: "Not enough quantity in stock" });
    }

    const cart = await Order.findOne({
      user_id: idUser,
      order_type: Status.CART,
    });

    const _product: ProductType = {
      product_id,
      name: product?.name,
      price: product?.price,
      color,
      size,
      quantity,
      image,
    };

    if (!cart) {
      const cartItem = new Order({
        code,
        user_id: idUser,
        total: quantity * Number(product?.price),
        products: [_product],
        order_type: Status.CART,
        payment_type: PaymentType.CASH,
        create_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        create_by:
          user?.email + "_INS_" + moment(new Date()).format("YYYY-MM-DD HH:mm"),
      });
      await cartItem.save();
      res
        .status(200)
        .json({ message: "Add cart successfully", result: cartItem });
    } else {
      //check cùng 1 sản phẩm và thuộc tính thì tăng số lượng
      const cartItemExists = await Order.findOneAndUpdate(
        {
          user_id: idUser,
          "products.product_id": product_id,
          order_type: Status.CART,
          "products.color": color,
          "products.size": size,
        },
        {
          $inc: {
            total: Number(product?.price) * quantity,
            "products.$.quantity": quantity,
          },
        },
        { new: true }
      );

      if (cartItemExists) {
        res
          .status(200)
          .json({ message: "Add cart successfully", result: cartItemExists });
      } else {
        const cartItemNew = await Order.findOneAndUpdate(
          {
            user_id: idUser,
            order_type: Status.CART,
          },
          {
            $push: { products: [_product] },
            $inc: {
              total: Number(product?.price) * quantity,
            },
          },
          { new: true }
        );
        if (cartItemNew) {
          res
            .status(200)
            .json({ message: "Add cart successfully", result: cartItemNew });
        } else {
          res.status(500).json({ message: "Add cart failed" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const idUser = getIdFromReq(req);
    const order = await Order.findOneAndUpdate(
      { user_id: idUser },
      {
        $set: {
          products: [],
          total: 0,
        },
      },
      { new: true }
    );
    if (order) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ message: "Failed To Clear Cart" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
