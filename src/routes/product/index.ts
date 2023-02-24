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
import { upload } from "utils/cloudinary";

const router = Router();

//User Routes (role==='USER')
router.get("/", getProducts);
router.get("/:id", validateToken, getProduct);
router.post("/recentProduct/:id", validateToken, recentProduct);
router.post("/productFavorites/:id", validateToken, productFavorites);

//User Routes (role==='ADMIN')
router.post(
  "/createProduct",
  validateToken,
  upload.array("images"),
  createProduct
);
router.post(
  "/updateProduct/:id",
  validateToken,
  upload.array("images"),
  updateProduct
);
router.post("/deleteProduct/:id", validateToken, deleteProduct);
router.post("/anActiveProduct/:id", validateToken, anActiveProduct);

export default router;
