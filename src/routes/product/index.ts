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
  searchProducts,
  filterProducts,
  getFlashSale,
  recentlyProduct,
  getForYou,
  getProductsByCategories,
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
router.post("/recently/:id", isUser, recentlyProduct);
router.get("/search_products/find", isUser, searchProducts);
router.get("/filter_products/find", isUser, filterProducts);
router.get("/flash_sale/get", getFlashSale);
router.get("/for_you/get", isUser, getForYou);
router.get("/categories/get", getProductsByCategories);

export default router;
