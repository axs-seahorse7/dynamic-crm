import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    /**
     * PER-MENU PERMISSIONS
     */
    permissions: [
      {
        module: {
          type: String,
          required: true, // "menu"
        },

        menuKey: {
          type: String, // "product", "customer"
          required: true,
        },

        actions: [
          {
            type: String,
            enum: ["view", "create", "update", "delete"],
            required: true,
          },
        ],
      },
    ],

    isSystemRole: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

roleSchema.index({ companyId: 1, name: 1 }, { unique: true });

export default mongoose.model("Role", roleSchema);
