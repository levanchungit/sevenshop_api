import { checkout, getInvoice } from "controllers/pay";
import { Router } from "express";
import { validateToken } from "middleware/validate";

const router = Router();

const isUser = [validateToken];

// pay routes
router.post("/", isUser, getInvoice);
router.post("/", isUser, checkout);

export default router;
