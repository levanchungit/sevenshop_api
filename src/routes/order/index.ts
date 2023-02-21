import { Router } from "express";
import { addToCart } from "controllers/order";
import { validateToken } from "middleware/validate";

const router = Router();

router.post("/addToCart", validateToken, addToCart);

export default router;
