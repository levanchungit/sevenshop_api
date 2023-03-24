import {
  addCart,
  changeQuantity,
  deleteProductCart,
  getCart,
  getQuantityCart,
} from "controllers/cart";
import { Router } from "express";
import { validateToken } from "middleware/validate";

const router = Router();

// Cart routes
router.get("/", validateToken, getCart);
router.post("/", validateToken, addCart);
router.put("/", validateToken, changeQuantity);
router.delete("/", validateToken, deleteProductCart);
router.get("/quantity_cart", validateToken, getQuantityCart);

export default router;
