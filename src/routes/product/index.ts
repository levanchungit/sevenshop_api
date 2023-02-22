import { validateToken } from "middleware/validate";
import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  anActiveProduct,
  getProducts,
  getProduct,
  recentProduct,
  productFavorites,
} from "controllers/product";

const router = Router();

//Auth routes
router.post("/createProduct", validateToken, createProduct);
router.post("/updateProduct/:id", validateToken, updateProduct);
router.post("/deleteProduct/:id", validateToken, deleteProduct);
router.post("/anActiveProduct/:id", validateToken, anActiveProduct);
router.get("/", getProducts);
router.get("/:id", validateToken, getProduct);
router.post("/recentProduct/:id", validateToken, recentProduct);
router.post("/productFavorites/:id", validateToken, productFavorites);

export default router;
