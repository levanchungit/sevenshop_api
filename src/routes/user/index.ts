import { Router } from "express";
import {
  register,
  checkOTP,
  login,
  setPassword,
  getMe,
  logout,
  refreshToken,
} from "controllers/user";
import { validateToken } from "middleware/validate";

const router = Router();

//Auth routes
router.post("/register", register);
router.post("/check_otp", checkOTP);
router.post("/set_password", validateToken, setPassword);
router.post("/login", login);
router.get("/me", validateToken, getMe);
router.post("/logout", validateToken, logout);
router.post("/refresh_token", refreshToken);

export default router;
