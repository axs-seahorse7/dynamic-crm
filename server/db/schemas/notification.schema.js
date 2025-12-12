// models/Notification.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" }, // recipient
  title: { type: String, required: true },
  body: { type: String },
  link: { type: String }, // optional: path to open in frontend
  type: { type: String, default: "info" }, // e.g. info, warning, success
  meta: { type: Schema.Types.Mixed, default: {} }, // any payload
  read: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" } // optional author
}, { timestamps: true });

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export default mongoose.model("Notification", NotificationSchema);
