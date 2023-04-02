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
  searchProducts,
  filterProducts,
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
router.get("/search_products/find", isUser, searchProducts);
router.get("/filter_products/find", isUser, filterProducts);

export default router;
