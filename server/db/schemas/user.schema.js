import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: {
      type: String,
    },

    profilePicture: String,

    password: {
      type: String,
      required: true,
      select: false, 
    },

    status: {
      type: String,
      enum: ["invited", "active", "blocked"],
      default: "invited",
    },

    lastLoginAt: Date,
    lastLogoutAt: Date,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)


const userModel = mongoose.model("User", userSchema);

export default userModel;