import {
  checkout,
  checkoutStripe,
  getIntents,
  getInvoice,
  getTransactions,
} from "controllers/pay";
import { Router } from "express";
import { validateToken } from "middleware/validate";

const router = Router();

const isUser = [validateToken];

// pay routes
router.post("/get_invoice", isUser, getInvoice);
router.post("/", isUser, checkout);
router.post("/stripe", isUser, checkoutStripe);
router.get("/transactions", isUser, getTransactions);
router.post("/intents", isUser, getIntents);

export default router;
