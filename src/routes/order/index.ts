import {
  getMyOrder,
  getMyOrders,
  getOrder,
  getOrders,
} from "controllers/order";
import { Router } from "express";
import { validateAdmin, validateToken } from "middleware/validate";

const router = Router();

const isUser = [validateToken];
const isAdmin = [validateAdmin];

// User order routes
router.get("/me", isUser, getMyOrders);
router.get("/me/:id", isUser, getMyOrder);

// Order routes (admin)
router.get("/", isAdmin, getOrders);
router.get("/:id", isAdmin, getOrder);
// router.put("/:id", isAdmin, updateOrder);
// router.delete("/:id", isAdmin, deleteOrder);

export default router;
