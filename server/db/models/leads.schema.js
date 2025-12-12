import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String },
    company: { type: String },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"],
      default: "New"
    },
    source: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: [NoteSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const leadModel = mongoose.model("Lead", LeadSchema);
export default leadModel;
