import { Request, Response } from "express";
const stripe = require("stripe")(process.env.SECRET_KEY);

const checkoutStripe = async (req: Request, res: Response) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (e) {
    res.sendStatus(500);
  }
};

export default checkoutStripe;
