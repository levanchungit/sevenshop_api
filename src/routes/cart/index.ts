import { addCart, changeQuantity, getCart } from "controllers/cart";
import { Router } from "express";
import { validateToken } from "middleware/validate";

const router = Router();

// Cart routes
router.get("/", validateToken, getCart);
router.post("/", validateToken, addCart);
router.put("/", validateToken, changeQuantity);

export default router;
