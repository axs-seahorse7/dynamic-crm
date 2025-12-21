import mongoose from 'mongoose';
import SectionSchema from './section.schema.js';

const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  layoutType: {
    type: String,
    enum: ['PSL'],
    default: 'PSL'
  },

  sections: [SectionSchema],

  createdAt: { type: Date, default: Date.now }
});

const Form = mongoose.model("Form", FormSchema);


export default Form;