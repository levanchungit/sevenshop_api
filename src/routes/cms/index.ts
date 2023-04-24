import { getProductById, getProducts } from "controllers/cms";
import { Router } from "express";
import { validateAdmin } from "middleware/validate";

const router = Router();

const isAdmin = [validateAdmin];

// Color routes
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
