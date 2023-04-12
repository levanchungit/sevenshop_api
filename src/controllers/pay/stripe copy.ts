import { Request, Response } from "express";
import User from "models/user";
import { getIdFromReq } from "utils/token";
const stripe = require("stripe")(process.env.SECRET_KEY);

const checkoutStripe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(getIdFromReq(req));
    if (!user) {
      return res.sendStatus(403);
    }
    const customer = await stripe.customers.create({
      id: user._id,
      email: user.email,
      name: user.full_name,
      phone: user.phone,
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2022-11-15" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "vnd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.PUBLISHABLE_KEY,
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export default checkoutStripe;
