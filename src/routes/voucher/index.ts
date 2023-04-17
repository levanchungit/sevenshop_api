import {
  addVoucherUser,
  createVoucher,
  deleteVoucher,
  getVoucherById,
  getVouchers,
  getVouchersUser,
  updateVoucher,
} from "controllers/voucher";
import { Router } from "express";
import { validateAdmin, validateToken } from "middleware/validate";

const router = Router();

const isAdmin = [validateAdmin];
const isUser = [validateToken];

router.post("/add_voucher/:code", isUser, addVoucherUser);
router.get("/get_vouchers", isUser, getVouchersUser);

router.get("/", isAdmin, getVouchers);
router.post("/", isAdmin, createVoucher);
router.get("/:id", isAdmin, getVoucherById);
router.put("/:id", isAdmin, updateVoucher);
router.delete("/:id", isAdmin, deleteVoucher);

export default router;
