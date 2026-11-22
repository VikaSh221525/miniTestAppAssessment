const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questions: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        text: String,
        options: [String],
        correctIndex: Number,
        subject: String,
      },
    ],
    answers: {
      // map of questionIndex -> chosen option index (-1 = skipped)
      type: Map,
      of: Number,
      default: {},
    },
    score: {
      type: Number,
      required: true,
    },
    timeTaken: {
      // seconds elapsed
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attempt', attemptSchema);
