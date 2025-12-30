import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true },
    legalName: { type: String },
    industry: { type: String },
    type: { type: String }, // Private Ltd, LLP, etc.

    // Contact Info
    email: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String },
    website: { type: String },

    // Address
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    // Registration Details
    gstNumber: String,
    panNumber: String,
    registrationNumber: String, // CIN for Indian companies
    foundedYear: Number,
    companySize: Number, // Number of employees

    // Documents
    documents: [
      {
        name: String,    // e.g. "GST Certificate"
        url: String,     // S3 URL
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // CRM Controls
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    tags: [String],
    premium:{
      type: Boolean,
      default: false
    },
    premiumExpiryDate: Date,
    premiumPlan: {
      type: String,
      enum: ["basic", "standard", "premium"],
    },
    storageUsedInMB: {
      type: Number,
      default: 0,
    },

    // Who created this record
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    isDeleted: { type: Boolean, default: false },
    loginEnabled: { type: Boolean, default: false },
    passwordHash: { type: String }, 
    loginTime: { type: Date },
    logoutTime: { type: Date },

    // Optional notes
    notes: String,
  },
  {
    timestamps: true,
  }
);

const companyModel = mongoose.model("Company", companySchema);
export default companyModel
