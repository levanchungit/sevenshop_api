import { createVoucher, getVouchers } from "controllers/voucher";
import { Router } from "express";
import { validateAdmin, validateToken } from "middleware/validate";

const router = Router();

const isAdmin = [validateAdmin];
const isUser = [validateToken];

router.get("/", isAdmin, getVouchers);
router.post("/", isAdmin, createVoucher);

export default router;
