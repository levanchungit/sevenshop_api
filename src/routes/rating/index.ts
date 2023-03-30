import {
  createRating,
  getNotYetRated,
  getRated,
  getRatings,
} from "controllers/rating";
import { Router } from "express";
import { validateToken } from "middleware/validate";

const router = Router();

const isUser = [validateToken];

router.post("/", isUser, createRating);
router.get("/not_yet_rated", isUser, getNotYetRated);
router.get("/rated", isUser, getRated);
router.get("/:id", isUser, getRatings);
// router.put("/:id", updateAddress);
// router.delete("/:id", deleteAddress);

export default router;
