import { create, getProduct, getProducts } from "controller/product";
import { Router } from "express";

const router = Router();

//Auth routes
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/create", create);

export default router;
