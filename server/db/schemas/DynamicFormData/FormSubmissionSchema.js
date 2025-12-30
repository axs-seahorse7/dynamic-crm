// models/FormSubmission.js
import mongoose from "mongoose";

const FormSubmissionSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DynamicForm",
      required: true,
    },
    
    formEntityType: {
      type: String, // "user" | "product"
      required: true,
    },

    formKey: {
      type: String, // "user" | "product"
      required: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed, // 🔥 ANY STRUCTURE
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("FormSubmission", FormSubmissionSchema);
