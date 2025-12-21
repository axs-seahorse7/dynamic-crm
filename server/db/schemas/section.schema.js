import mongoose from 'mongoose';
import FieldSchema from './Field.schema.js';

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  width: {
    type: Number,
    min: 30,
    max: 100,
    required: true
  },

  layoutMode: {
    type: String,
    enum: ['grid'],
    default: 'grid'
  },

  grid: {
    columns: { type: Number, default: 12 },
    gap: { type: Number, default: 16 }
  },

  fields: [FieldSchema]
});

export default SectionSchema;