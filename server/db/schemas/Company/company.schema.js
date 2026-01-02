import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    logoUrl: {
      type: String,
    },

    businessEmail: {
      type: String,
      lowercase: true,
    },

    businessPhone: {
      type: String,
    },

    website: {
      type: String,
    },

    industry: {
      type: String, 
    },

    size: {
      type: String,
    },

    address: {
      country: String,
      state: String,
      city: String,
      pincode: String,
    },

    plan: {
      type: String,
      enum: ["free", "starter", "pro", "enterprise"],
      default: "free",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
