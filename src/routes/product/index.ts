import { validateAdmin, validateToken } from "middleware/validate";
import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  generateStock,
  productFavorites,
  getFavorites,
  deleteFavorites,
} from "controllers/product";

const router = Router();
const isAdmin = [validateAdmin];
const isUser = [validateToken];

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", isAdmin, createProduct);
router.get("/generate_stock/:id", isAdmin, generateStock);
router.put("/:id", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.post("/favorites/:id", isUser, productFavorites);
router.get("/favorites/get", isUser, getFavorites);
router.delete("/favorites/:id", isUser, deleteFavorites);

export default router;
