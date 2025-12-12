// routes/notifications.js
import { Router } from "express";
import { listNotifications, markRead, markAllRead, deleteNotification, createNotification } from "../controlers/Notification/notificationContoller.js";
import { isAuthenticated } from "../middleware/isAuth.js";
import { requirePermission } from "../middleware/requirePermission.js";

const router = Router();

// router.use(isAuthenticated);

// list
router.get("/", listNotifications);

router.post("/create", createNotification);

// create (only admins/managers) - optional admin-only creation endpoint
router.post("/", requirePermission("canManageUsers"), createNotification);

// mark single read
router.post("/mark-read/:id", markRead);

// mark all read
router.post("/mark-all-read", markAllRead);

// delete
router.delete("/:id", deleteNotification);

export default router;
