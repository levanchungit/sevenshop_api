import { getUsers } from "controllers/user";
import getUserById from "controllers/user/get_user";
import { Router } from "express";
import { validateAdmin, validateToken } from "middleware/validate";
import addressRouter from "./address";

const router = Router();

const isAdmin = [validateAdmin];
const isUser = [validateToken];

router.get("/", isAdmin, getUsers);
router.get("/get/:id", isAdmin, getUserById);

router.use("/addresses", isUser, addressRouter);

export default router;
