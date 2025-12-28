// models/Form.js
import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
    name: String,        // "username", "qty"
    label: String,       // "User Name"
    type: String,        // "text", "number", "date"
    required: Boolean,
  },
  { _id: false }
);

const DynamicForm = new mongoose.Schema(
  {
    formName: String,        // "User Form", "Product Form"
    formKey: String,         // "user", "product"
    fields: [FieldSchema],
  },
  { timestamps: true }
);

export default mongoose.model("DynamicForm", DynamicForm);
