const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: (v) => v.length === 4,
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    subject: {
      type: String,
      default: 'General',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
