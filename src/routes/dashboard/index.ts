import { validateAdmin } from "middleware/validate";
import { Router } from "express";
import { getRevenue } from "controllers/dashboard";

const router = Router();
const isAdmin = [validateAdmin];

router.get("/", isAdmin, getRevenue);

export default router;
