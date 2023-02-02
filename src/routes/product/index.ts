import { Router } from "express";
import { create, getProduct, getProducts } from "controllers/product";

const router = Router();

//Auth routes
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/create", create);

export default router;
