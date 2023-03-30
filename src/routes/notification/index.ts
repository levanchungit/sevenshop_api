import { validateAdmin, validateToken } from "middleware/validate";
import { Router } from "express";
import {
  createNotification,
  getNotifications,
  getNotificationsUser,
} from "controllers/notification";

const router = Router();
const isAdmin = [validateAdmin];
const isUser = [validateToken];

router.post("/", isAdmin, createNotification);
router.get("/get", isUser, getNotifications);
router.get("/get/:user_id", isUser, getNotificationsUser);

export default router;
