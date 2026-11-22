const express = require('express');
const Question = require('../models/Question');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/admin/questions — add a new question
router.post('/questions', auth, adminOnly, async (req, res) => {
  try {
    const { text, options, correctIndex, subject } = req.body;

    if (!text || !options || correctIndex === undefined)
      return res.status(400).json({ message: 'text, options, and correctIndex are required' });

    if (!Array.isArray(options) || options.length !== 4)
      return res.status(400).json({ message: 'options must be an array of 4 strings' });

    if (correctIndex < 0 || correctIndex > 3)
      return res.status(400).json({ message: 'correctIndex must be 0–3' });

    const question = await Question.create({ text, options, correctIndex, subject });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/admin/questions — list all questions
router.get('/questions', auth, adminOnly, async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/admin/questions/:id
router.delete('/questions/:id', auth, adminOnly, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
