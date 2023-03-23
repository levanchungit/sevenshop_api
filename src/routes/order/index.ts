import { Router } from "express";
import {
  getMyOrder,
  getMyOrders,
  getOrder,
  getOrders,
  updateStatusOrder,
} from "controllers/order";

import { validateAdmin, validateToken } from "middleware/validate";

const router = Router();

const isAdmin = [validateAdmin];
const isUser = [validateToken];

// Order routes (user)
router.get("/me", isUser, getMyOrders);
router.get("/me/:id", isUser, getMyOrder);

// Order routes (admin)
router.get("/", isAdmin, getOrders);
router.get("/get/:id", isAdmin, getOrder);
router.put("/:id", isAdmin, updateStatusOrder);

export default router;
