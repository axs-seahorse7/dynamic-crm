// controllers/notificationController.js
import mongoose from "mongoose";
import Notification from "../../db/schemas/Notification/notification.schema.js";


export const listNotifications = async (req, res) => {
  try {
    const userId = req.query.userId;
    const page = Math.max(1, parseInt(req.query.page || 1));
    const limit = Math.max(5, parseInt(req.query.limit || 25));
    const read = req.query.read; // "true" | "false" | undefined

    const q = { userId };
    // if (read === "true") q.read = true;
    // if (read === "false") q.read = false;

    const total = await Notification.countDocuments();
    const notifications = await Notification.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      notifications,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/notifications/mark-read/:id
 * mark a single notification as read
 */
export const markRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    const n = await Notification.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });
    if (!n) return res.status(404).json({ message: "Notification not found" });
    res.json(n);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/notifications/mark-all-read
 * Marks all unread notifications for user as read
 */
export const markAllRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ userId, read: false }, { read: true });
    res.json({ message: "All notifications marked read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    const n = await Notification.findOneAndDelete({ _id: id, userId });
    if (!n) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/notifications
 * Create new notification (admin or internal use).
 * Body: { userId, title, body, link, type, meta }
 */
export const createNotification = async (req, res) => {
  try {
    const {  title, body, link, type, meta } = req.body;
    if (!title || !body) return res.status(400).json({ message: "title and body required" });
    const n = await Notification.create({  
      title,
      body,
      link,
      type,
      meta,
      createdBy: req.user?._id
    });
    // Optionally emit socket event here if you use Socket.io
    // req.app.get('io')?.to(String(userId)).emit('notification', n);
    res.status(201).json(n);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
