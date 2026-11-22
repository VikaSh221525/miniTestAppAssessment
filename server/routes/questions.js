const express = require('express');
const Question = require('../models/Question');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/questions — returns 10 random questions (no correct answer exposed)
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);

    if (questions.length < 10) {
      return res.status(400).json({ message: 'Not enough questions in the database' });
    }

    // Strip correctIndex before sending to client
    const sanitized = questions.map(({ _id, text, options, subject }) => ({
      _id,
      text,
      options,
      subject,
    }));

    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
