import { Router } from "express";
import {
  register,
  checkOTP,
  login,
  setPassword,
  getMe,
  logout,
} from "controller/user";
import { validateToken } from "middleware/validate";

const router = Router();

//Auth routes
router.post("/register", register);
router.post("/check-otp", checkOTP);
router.post("/set-password",validateToken, setPassword);
router.post("/login", login);
router.get("/me", validateToken, getMe);
router.get("/logout",validateToken, logout);

export default router;
