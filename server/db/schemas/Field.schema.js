import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, required: true },

  required: { type: Boolean, default: false },
  placeholder: { type: String },

  options: {
    type: [String],
    default: []
  },

  layout: {
    gridWidth: {
      type: String,
      enum: ['full', 'half', 'third', 'quarter', 'manual'],
      default: 'full'
    },

    colSpan: {
      type: Number,
      enum: [12, 6, 4, 3],
      default: 12
    },

    fieldWidthPx: {
      type: Number,
      default: null // only when gridWidth === 'manual'
    }
  }
});

export default FieldSchema;