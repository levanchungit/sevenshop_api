import { validateAdmin, validateToken } from "middleware/validate";
import { Router } from "express";
import {
  createNotification,
  getNotifications,
  getNotificationsUser,
  getTokens,
  pushNotifications,
  pushNotificationsAll,
} from "controllers/notification";

const router = Router();
const isAdmin = [validateAdmin];
const isUser = [validateToken];

router.post("/", isAdmin, createNotification);
router.get("/get", isUser, getNotifications);
router.get("/get/:user_id", isUser, getNotificationsUser);
router.post("/push_notifications", isAdmin, pushNotifications);
router.get("/get_tokens", isAdmin, getTokens);
router.post("/push_notifications_all", isAdmin, pushNotificationsAll);

export default router;
