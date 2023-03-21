import { createSize, deleteSize, getSizes, updateSize } from "controllers/size";
import getSizeById from "controllers/size/get_size";
import { Router } from "express";
import { validateAdmin } from "middleware/validate";

const router = Router();

const isAdmin = [validateAdmin];

// Size routes
router.get("/", getSizes);
router.get("/:id", getSizeById);
router.post("/", isAdmin, createSize);
router.put("/:id", isAdmin, updateSize);
router.delete("/:id", isAdmin, deleteSize);

export default router;
