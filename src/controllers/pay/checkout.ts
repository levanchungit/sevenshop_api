import { STATUS_ORDER } from "constants/order";
import { ROLE } from "constants/user";
import { STATUS_VOUCHER_USER } from "constants/voucher";
import { pushNotifications } from "controllers/notification";
import { Request, Response } from "express";
import { IInvoice } from "interfaces/invoice";
import Cart from "models/cart";
import Order from "models/order";
import Product from "models/product";
import User from "models/user";
import mongoose from "mongoose";
import { getNow } from "utils/common";
import { getIdFromReq } from "utils/token";

const checkout = async (req: Request, res: Response) => {
  try {
    const id_user = getIdFromReq(req);
    const user = await User.findById(id_user);
    if (!user) {
      return res.sendStatus(403);
    }
    const {
      products,
      total_invoice,
      total_invoice_before_discount,
      total_invoice_discount,
      payment_type,
      address,
      note,
      voucher_id,
    }: IInvoice = req.body;

    //check address exists in user
    if (user.addresses) {
    }
    const addressExists = user.addresses.filter(
      (addressItem) => addressItem._id?.toString() == address?._id?.toString()
    );
    if (addressExists.length == 0) {
      return res.status(400).json({ message: "Address is not exists" });
    }

    //check product not exists in cart error
    const _cart = await Cart.findOne({ user_id: id_user });
    if (_cart) {
      const productsInCart = _cart.products.filter((product) => {
        return products.find(
          (productItem) =>
            productItem.product_id.toString() == product.product_id &&
            productItem.color_id == product.color_id.toString() &&
            productItem.size_id == product.size_id.toString()
        );
      });
      if (productsInCart.length != products.length) {
        return res
          .status(400)
          .json({ message: "Product is not exists in cart" });
      }
    }

    //remove product in cart
    const cart = await Cart.findOne({ user_id: id_user });
    if (cart) {
      const newProducts = cart.products.filter((product) => {
        return !products.find(
          (productItem) =>
            productItem.product_id.toString() == product.product_id &&
            productItem.color_id == product.color_id.toString() &&
            productItem.size_id == product.size_id.toString()
        );
      });
      cart.products = newProducts;
      await cart.save();
    }

    //update stock quantity product
    try {
      for (const product of products) {
        const { product_id, quantity, size_id, color_id } = product;

        const productItem = await Product.findById(product_id);
        if (!productItem) {
          throw new Error(`Product ${product_id} not found`);
        }

        //update quantity stock product product_id, size_id, color_id
        productItem.stock.map((stock) => {
          if (
            stock.size_id?.toString() === size_id &&
            stock.color_id?.toString() === color_id
          ) {
            stock.quantity = stock.quantity - quantity;
          }
        });

        await productItem.save();
      }
    } catch (err: any) {
      return res.status(400).json({ message: err.message });
    }

    //check voucher exists and update user voucher status to used
    if (voucher_id) {
      user.vouchers.map((voucher) => {
        if (voucher.voucher_id.toString() == voucher_id) {
          voucher.status = STATUS_VOUCHER_USER.used;
        }
      });

      user.modify.push({
        action: `Used voucher ${voucher_id}`,
        date: getNow(),
      });

      await user.save();
    }

    // //create order
    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      user_id: id_user,
      products,
      total_price: total_invoice,
      total_discount: total_invoice_discount,
      total_before_discount: total_invoice_before_discount,
      payment_type,
      address,
      note: voucher_id ? `Used Voucher: ${voucher_id}` : note,
      voucher_id,
      status: STATUS_ORDER.pending,
      created_at: getNow(),
      created_by: user.email,
      modify: [
        {
          status: STATUS_ORDER.pending,
          modify_at: getNow(),
          modify_by: `${user.email} send order`,
        },
      ],
    });

    await newOrder.save();

    //send email to user

    //send email to admin

    //push notification to admin

    // get device_id all user role admin
    const adminUsers = await User.find({ role: ROLE.admin });
    const adminIds: string[] = [];
    const adminDeviceIds: string[] = [];
    adminUsers.forEach((user) => {
      if (user.device_id != "") {
        adminIds.push(user._id.toString()), adminDeviceIds.push(user.device_id);
      }
    });

    const notification = {
      title: "New order #",
      body: `New order from ${user.email}`,
      image:
        "https://res.cloudinary.com/dzhlsdyqv/image/upload/v1681919879/Image/Logo_128_zzjr4f.png",
      to_user_id: adminIds,
      tokens: adminDeviceIds,
    };

    try {
      await pushNotifications(req, res, notification);
    } catch (err) {
      console.log("BUG", err);
    }

    const results = {
      _id: newOrder._id,
      created_at: newOrder.created_at,
      payment_type: newOrder.payment_type,
    };
    return res.status(201).json({ results });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default checkout;
