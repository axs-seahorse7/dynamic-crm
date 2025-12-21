const ElementSchema = new mongoose.Schema({
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Page"
  },

  type: {
    type: String,
    enum: ["Text", "Input", "Button", "Image", "Select", "Container"],
    required: true
  },

  content: {
    type: String, // text, placeholder, button label, etc.
    default: ""
  },

  position: {
    type: {
      type: String,
      default: "absolute" // absolute | relative | fixed
    },
    top: Number,
    left: Number,
    right: Number,
    bottom: Number,
    zIndex: Number
  },

  size: {
    width: Number,
    height: Number,
    minWidth: Number,
    minHeight: Number,
    maxWidth: Number,
    maxHeight: Number
  },

  style: {
    color: String,
    backgroundColor: String,

    font: {
      family: String,
      size: Number,
      weight: String,
      style: String, // normal | italic
      lineHeight: Number,
      textAlign: String
    },

    border: {
      width: Number,
      style: String,
      color: String,
      radius: Number
    },

    boxShadow: String,
    opacity: Number,
    cursor: String,
    overflow: String
  },

  responsive: {
    mobile: Object,
    tablet: Object,
    desktop: Object
  }
});

const ElementStyle = mongoose.model('ElementStyle', ElementSchema);
export default ElementStyle;