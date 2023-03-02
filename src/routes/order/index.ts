import { validateAdmin } from "./../../middleware/validate";
import { Router } from "express";
import {
  getAll,
  getOrdersByUserID,
  addToCart,
  removeFromCart,
  clearCart,
  updateProductCartQuantity,
} from "controllers/order";
import { validateToken } from "middleware/validate";

const router = Router();

router.get("/", validateAdmin, getAll);
router.get("/getOrderByUserID", validateToken, getOrdersByUserID);
router.post("/addToCart", validateToken, addToCart);
// router.post("/removeFromCart/:id", validateToken, removeFromCart);
router.post("/removeFromCart", validateToken, removeFromCart);
router.post("/clearCart", validateToken, clearCart);
router.post(
  "/updateProductCartQuantity",
  validateToken,
  updateProductCartQuantity
);

export default router;
