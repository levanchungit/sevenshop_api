import { validateAdmin } from "middleware/validate";
import { Router } from "express";
import { chartOrder } from "controllers/revenue";

const router = Router();
const isAdmin = [validateAdmin];

router.get("/", isAdmin, chartOrder);

export default router;
