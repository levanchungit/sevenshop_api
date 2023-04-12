import { Request, Response } from "express";
import Stripe from "stripe";

const getTransactions = async (req: Request, res: Response) => {
  try {
    const STRIPE_SECRET_KEY = process.env.SECRET_KEY;

    if (!STRIPE_SECRET_KEY) {
      return res.sendStatus(500);
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    });

    const paymentIntents = await stripe.paymentIntents.list({ limit: 100 });

    return res.json(paymentIntents);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default getTransactions;
