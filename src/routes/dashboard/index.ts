import { validateAdmin } from "middleware/validate";
import { Router } from "express";
import { revenueDay } from "controllers/dashboard";

const router = Router();
const isAdmin = [validateAdmin];

router.get("/revenue_day", isAdmin, revenueDay);

export default router;
