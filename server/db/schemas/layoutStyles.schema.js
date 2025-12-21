import mongoose from 'mongoose';

const LayoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  layout: {
    pageSize: {
      width: { type: Number, default: 1200 },
      height: { type: Number, default: 800 },
      unit: { type: String, default: "px" } // px | % | vh | vw
    },

    background: {
      color: { type: String, default: "#ffffff" },
      image: { type: String, default: "" },
      repeat: { type: String, default: "no-repeat" },
      size: { type: String, default: "cover" }
    },

    padding: {
      top: { type: Number, default: 0 },
      right: { type: Number, default: 0 },
      bottom: { type: Number, default: 0 },
      left: { type: Number, default: 0 }
    }
  },

  elements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Element"
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LayoutStyles = mongoose.model('LayoutStyles', LayoutSchema);
export default LayoutStyles;