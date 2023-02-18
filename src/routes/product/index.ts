import { validateToken } from "middleware/validate";
import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  anActiveProduct,
  getProducts,
  getProduct,
} from "controllers/product";

const router = Router();

//Auth routes
router.post("/createProduct", validateToken, createProduct);
router.post("/updateProduct/:id", validateToken, updateProduct);
router.post("/deleteProduct/:id", validateToken, deleteProduct);
router.post("/anActiveProduct/:id", validateToken, anActiveProduct);
router.get("/", validateToken, getProducts);
router.get("/:id", validateToken, getProduct);

export default router;
