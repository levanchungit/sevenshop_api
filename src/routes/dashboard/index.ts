import { validateAdmin } from "middleware/validate";
import { Router } from "express";
import {
  countQuantity,
  getHistorySearch,
  getModifyAllTable,
  getProductsBestSeller,
  revenueDay,
} from "controllers/dashboard";

const router = Router();
const isAdmin = [validateAdmin];

router.get("/revenue_day", isAdmin, revenueDay);
router.get("/count_quantity", isAdmin, countQuantity);
router.get("/get_history_search", isAdmin, getHistorySearch);
router.get("/get_products_best_seller", isAdmin, getProductsBestSeller);
router.get("/get_feed", isAdmin, getModifyAllTable);

export default router;
