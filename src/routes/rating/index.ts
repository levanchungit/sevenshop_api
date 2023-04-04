import { createRating, getNotYetRated, getRated } from "controllers/rating";
import { Router } from "express";
import { validateToken } from "middleware/validate";

const router = Router();

const isUser = [validateToken];

router.post("/", isUser, createRating);
router.get("/not_yet_rated", isUser, getNotYetRated);
router.get("/rated", isUser, getRated);

export default router;
