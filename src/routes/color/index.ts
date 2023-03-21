import { Router } from "express";
import { validateAdmin } from "middleware/validate";
import {
  createColor,
  deleteColor,
  getColors,
  updateColor,
} from "controllers/color";
import getColorById from "controllers/color/get_color";

const router = Router();

const isAdmin = [validateAdmin];

// Color routes
router.get("/", getColors);
router.get("/:id", getColorById);
router.post("/", isAdmin, createColor);
router.put("/:id", isAdmin, updateColor);
router.delete("/:id", isAdmin, deleteColor);

export default router;
