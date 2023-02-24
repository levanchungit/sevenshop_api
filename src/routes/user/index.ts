import { Router } from "express";
import {
  register,
  checkOTP,
  login,
  setPassword,
  getMe,
  logout,
  refreshToken,
  getUsers,
  getUserByID,
  updateUser,
  deleteUser,
  changePassword,
} from "controllers/user";
import { validateToken, validateAdmin } from "middleware/validate";
import { upload } from "utils/cloudinary";

const router = Router();

//Auth routes
router.post("/register", register);
router.post("/check_otp", checkOTP);
router.post("/set_password", validateToken, setPassword);
router.post("/login", login);
router.post("/logout", validateToken, logout);
router.post("/refresh_token", refreshToken);

//User Routes (role==='USER')
router.get("/me", validateToken, getMe);
router.post(
  "/updateUser/:id",
  validateToken,
  upload.single("image"),
  updateUser
);
router.post("/changePassword", validateToken, changePassword);

//User Routes (role==='ADMIN')
router.get("/", validateToken, validateAdmin, getUsers);
router.get("/:id", validateToken, validateAdmin, getUserByID);
router.post("/deleteUser/:id", validateToken, validateAdmin, deleteUser);

export default router;
