import { Request, Response } from "express";
import User from "models/user";
import { getIdFromReq } from "utils/token";
const stripe = require("stripe")(process.env.SECRET_KEY);

const getIntents = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(getIdFromReq(req));

    //create customer
    const customer = await stripe.customers.create({
      name: user?.full_name,
      email: user?.email,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "vnd",
      customer: customer.id,
      // Verify your integration in this guide by including this parameter
      // metadata: { integration_check: "accept_a_payment" },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (err) {
    res.sendStatus(500);
  }
};

export default getIntents;
