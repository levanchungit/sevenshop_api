import {
  addCart,
  changeQuantity,
  changeSizeColor,
  deleteProductsCart,
  getCart,
  getQuantityCart,
  getTotalCart,
} from "controllers/cart";
import { Router } from "express";
import { validateToken } from "middleware/validate";

const router = Router();

// Cart routes
router.get("/", validateToken, getCart);
router.post("/", validateToken, addCart);
router.put("/", validateToken, changeQuantity);
router.delete("/", validateToken, deleteProductsCart);
router.get("/quantity_cart", validateToken, getQuantityCart);
router.get("/total_cart", validateToken, getTotalCart);
router.put("/change_size_color", validateToken, changeSizeColor);

export default router;
