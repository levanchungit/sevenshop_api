import { Router } from "express";
import {
  register,
  checkOTP,
  login,
  setPassword,
  getUser,
} from "../../controller/User";
import { validateToken } from "../../middleware/validate";

const router = Router();

//Auth routes
router.post("/register", register);
router.post("/check-otp", checkOTP);
router.post("/setPassword", setPassword);
router.post("/login", login);
router.get("/:username", validateToken, getUser);

export default router;
