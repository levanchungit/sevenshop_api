import { create, getProduct, getProducts } from "controller/product";
import { Router } from "express";
import create from '../../controller/products/create';

const router = Router();

//Auth routes
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/create", create);

export default router;
