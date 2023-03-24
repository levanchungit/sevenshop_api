import { validateAdmin } from "middleware/validate";
import { Router } from "express";
import { revenueDay } from "controllers/revenue";

const router = Router();
const isAdmin = [validateAdmin];

router.get("/", isAdmin, revenueDay);

export default router;
