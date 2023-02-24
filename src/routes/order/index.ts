import { Router } from "express";
import { getAll, addToCart } from "controllers/order";
import { validateToken } from "middleware/validate";

const router = Router();

router.get("/", validateToken, getAll);
router.post("/addToCart", validateToken, addToCart);

export default router;
