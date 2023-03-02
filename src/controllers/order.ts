import { IProduct } from "./../models/product";
import Product from "models/product";
import Order, { IOrder, PaymentType, ProductType, STATUS } from "models/order";
import moment from "moment";
import { Request, Response } from "express";
import User from "models/user";
import { getIdFromReq, parseJwt, tokenGen } from "utils/token";
import { Stats } from "fs";
import { Types } from "mongoose";

export const getAll = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res
      .status(200)
      .json({ message: "Get Orders Successfully", result: orders });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const getOrdersByUserID = async (req: Request, res: Response) => {
  try {
    const idUser = getIdFromReq(req);
    const { order_type } = req.query;
    let orders: (IOrder & { _id: Types.ObjectId })[] = [];
    //order_type 0 GET ALL, 1 CART, 2 DELIVERY, 3 SUCCESSFULLY, 4 CANCEL
    if (Number(order_type) === 0) {
      orders = await Order.aggregate([
        {
          $project: {
            code: 1,
            total: 1,
            user_id: 1,
            products: 1,
            order_type: 1,
            payment_type: 1,
            voucher_type: 1,
          },
        },
      ]);
    } else if (Number(order_type) === STATUS.CART) {
      orders = await Order.find({ user_id: idUser, order_type: STATUS.CART });
    } else if (Number(order_type) === STATUS.DELIVERY) {
      orders = await Order.find({
        user_id: idUser,
        order_type: STATUS.DELIVERY,
      });
    } else if (Number(order_type) === STATUS.SUCCESSFULLY) {
      orders = await Order.find({
        user_id: idUser,
        order_type: STATUS.SUCCESSFULLY,
      });
    } else if (Number(order_type) === STATUS.CANCEL) {
      orders = await Order.find({
        user_id: idUser,
        order_type: STATUS.CANCEL,
      });
    }

    res
      .status(200)
      .json({ message: "Get Orders By User ID Successfully", result: orders });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { product_id, color_id, size_id, quantity, image } = req.body;
    const idUser = getIdFromReq(req);
    const user = await User.findById(idUser);
    const product = await Product.findById(product_id);

    if (!product) {
      res.status(500).json({ message: "Product not found" });
    }

    let countColor = 0;
    let countSize = 0;
    let quantityProperties = 0;
    if (product != null) {
      //check products not exists properties_type
      for (let i = 0; i < product.properties_type.length; i++) {
        const _color_id = product.properties_type[i].color_id;
        const _size_id = product.properties_type[i].size_id;
        if (color_id != _color_id) countColor += 1;
        if (size_id != _size_id) countSize += 1;
        if (color_id == _color_id && size_id == _size_id) {
          quantityProperties = product.properties_type[i].quantity;
        }
        if (
          countColor == product.properties_type.length ||
          countSize == product.properties_type.length
        )
          return res.status(500).json({ message: "Properties not exists" });
      }
    }

    if (quantity > Number(product?.storage_quantity)) {
      return res.status(500).json({ message: "Not enough quantity in stock" });
    }

    if (quantity > quantityProperties) {
      return res.status(500).json({ message: "Not enough quantity in stock" });
    }

    const orderCount = await Order.count();

    const cart = await Order.findOne({
      user_id: idUser,
      order_type: STATUS.CART,
    });
    let _product;
    if (product != null) {
      _product = {
        product_id,
        name: product.name,
        price: product.price,
        color_id,
        size_id,
        quantity,
        image,
      };
    }

    if (cart != null) {
      //check số lượng mới + sản phẩm đã có > trong kho
      for (let i = 0; i < cart.products.length; i++) {
        const _color_id = cart.products[i].color_id;
        const _size_id = cart.products[i].size_id;
        const _quantity = cart.products[i].quantity;
        const _product_id = cart.products[i].product_id;
        if (
          _color_id == color_id &&
          _size_id == size_id &&
          _product_id == product_id
        ) {
          if (_quantity + quantity > quantityProperties) {
            return res
              .status(500)
              .json({ message: "Not enough quantity in stock" });
          }
        }
      }
    }

    //chưa có cart -> add new
    if (!cart) {
      const cartItem = new Order({
        code: "#" + Number(orderCount + 1),
        user_id: idUser,
        total: quantity * Number(product?.price),
        products: [_product],
        order_type: STATUS.CART,
        payment_type: PaymentType.CASH,
        create_at: moment(new Date()).format("YYYY-MM-DD HH:mm"),
        create_by:
          user?.email + "_INS_" + moment(new Date()).format("YYYY-MM-DD HH:mm"),
      });
      const cart = await cartItem.save();

      res
        .status(200)
        .json({ message: "Add new cart successfully", result: cart });
    } else {
      //check cùng 1 sản phẩm và thuộc tính thì tăng số lượng
      const cartItemExists = await Order.findOneAndUpdate(
        {
          user_id: idUser,
          order_type: STATUS.CART,
          "products.product_id": product_id,
          "products.color_id": color_id,
          "products.size_id": size_id,
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
            order_type: STATUS.CART,
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
            .json({ message: "Update cart successfully", result: cartItemNew });
        } else {
          res.status(500).json({ message: "Update cart failed" });
        }
      }
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const idUser = getIdFromReq(req);

    // REMOVE 1 PRODUCT
    // const products_id = req.params.id;
    // const updateOrder = await Order.findOneAndUpdate(
    //   { user_id: idUser, order_type: STATUS.CART },
    //   {
    //     $pull: {
    //       products: { _id: products_id },
    //     },
    //   },
    //   { new: true }
    // );
    // if (updateOrder != null) {
    //   //update price
    //   let total = 0;
    //   for (let i = 0; i < updateOrder?.products.length; i++) {
    //     const _price = updateOrder.products[i].price;
    //     const _quantity = updateOrder.products[i].quantity;
    //     total += _price * _quantity;
    //   }
    //   updateOrder.total = total;
    //   await updateOrder.save();
    // }
    // if (updateOrder) {
    //   res.status(200).json({ message: "Remove From Cart Successfully" });
    // } else {
    //   res.status(500).json({ message: "Remove From Cart Failed" });
    // }

    //REMOVE MANY PRODUCT
    const { products_id } = req.body;
    console.log(products_id);
    const removeItem = await Order.update(
      {
        user_id: idUser,
        order_type: STATUS.CART,
      },
      {
        $pull: {
          products: {
            _id: { $in: products_id },
          },
        },
      }
    );
    if (removeItem) {
      //update price
      let total = 0;
      const updateTotal = await Order.findOne({
        user_id: idUser,
        order_type: STATUS.CART,
      });
      if (updateTotal != null) {
        for (let i = 0; i < updateTotal.products.length; i++) {
          const _price = updateTotal.products[i].price;
          const _quantity = updateTotal.products[i].quantity;
          total += _price * _quantity;
        }
        updateTotal.total = total;
        await updateTotal.save();
        res.status(200).json({ message: "Remove From Cart Successfully" });
      }
    } else {
      res.status(500).json({ message: "Remove From Cart Failed" });
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
      res.status(200).json({ success: "Clear Cart Successfully" });
    } else {
      res.status(500).json({ message: "Failed To Clear Cart" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export const updateProductCartQuantity = async (
  req: Request,
  res: Response
) => {
  try {
    const idUser = getIdFromReq(req);
    const { product_id, color_id, size_id, quantity } = req.body;
    const product = await Product.findById({ _id: product_id });
    if (!product) {
      return res.status(500).json({ message: "Product not found" });
    }

    let countColor = 0;
    let countSize = 0;
    let quantityProperties = 0;

    if (product != null) {
      //check products not exists properties_type
      for (let i = 0; i < product.properties_type.length; i++) {
        const _color_id = product.properties_type[i].color_id;
        const _size_id = product.properties_type[i].size_id;
        if (color_id != _color_id) countColor += 1;
        if (size_id != _size_id) countSize += 1;
        if (color_id == _color_id && size_id == _size_id) {
          quantityProperties = product.properties_type[i].quantity;
        }
        if (
          countColor == product.properties_type.length ||
          countSize == product.properties_type.length
        )
          return res.status(500).json({ message: "Properties not exists" });
      }
    }

    //check quantity
    const cart = await Order.findOne({
      user_id: idUser,
      order_type: STATUS.CART,
    });

    if (cart != null) {
      //check số lượng mới + sản phẩm đã có > trong kho
      for (let i = 0; i < cart.products.length; i++) {
        const _color_id = cart.products[i].color_id;
        const _size_id = cart.products[i].size_id;
        const _quantity = cart.products[i].quantity;
        const _product_id = cart.products[i].product_id;
        if (
          _color_id == color_id &&
          _size_id == size_id &&
          _product_id == product_id
        ) {
          if (_quantity + quantity > quantityProperties) {
            return res
              .status(500)
              .json({ message: "Not enough quantity in stock" });
          }
        }
      }
    }

    const order = await Order.findOneAndUpdate(
      {
        user_id: idUser,
        order_type: STATUS.CART,
        products: { $elemMatch: { product_id, color_id, size_id } },
      },
      {
        $inc: {
          "products.$.quantity": quantity,
          total: product.price * quantity,
        },
      },
      { new: true }
    );

    if (order) {
      res.status(200).json({
        message: "Update Quantity Successfully",
        result: order.products,
      });
    } else {
      res.status(500).json({ message: "Update Quantity Failed" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
