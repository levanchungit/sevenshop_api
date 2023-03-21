import { getUsers } from "controllers/user";
import { Router } from "express";
import { validateAdmin, validateToken } from "middleware/validate";
import addressRouter from "./address";

const router = Router();

const isAdmin = [validateAdmin];
const isUser = [validateToken];

router.get("/", isAdmin, getUsers);

router.use("/addresses", isUser, addressRouter);

export default router;
