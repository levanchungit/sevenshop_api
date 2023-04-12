import {
  addSearchHistory,
  deleteUser,
  getSearchHistory,
  getUsers,
  updateSelfUser,
  updateUser,
} from "controllers/user";
import getUserById from "controllers/user/get_user";
import { Router } from "express";
import { validateAdmin, validateToken } from "middleware/validate";
import addressRouter from "./address";

const router = Router();

const isAdmin = [validateAdmin];
const isUser = [validateToken];

router.get("/", isAdmin, getUsers);
router.get("/get/:id", isAdmin, getUserById);
router.put("/get", isUser, updateSelfUser);
router.post("/add_keyword_search", isUser, addSearchHistory);
router.get("/get_keyword_search", isUser, getSearchHistory);
router.put("/:id", isAdmin, updateUser);
router.delete("/:id", isAdmin, deleteUser);

router.use("/addresses", isUser, addressRouter);

export default router;
