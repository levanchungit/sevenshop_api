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

    const { lineItems } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel",
    });
    console.log(session);
    res.json(session);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export default checkoutStripe;
