const express = require('express');
const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const { auth } = require('../middleware/auth');

const router = express.Router();

// POST /api/attempts — submit answers, calculate score, store attempt
router.post('/', auth, async (req, res) => {
  try {
    const { questionIds, answers, timeTaken } = req.body;
    // answers: { "0": 2, "1": 0, ... } — index -> chosen option index

    if (!questionIds || !Array.isArray(questionIds) || questionIds.length !== 10) {
      return res.status(400).json({ message: 'Must submit exactly 10 question IDs' });
    }

    // Fetch the actual questions with correct answers from DB
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Build a map for quick lookup
    const questionMap = {};
    questions.forEach((q) => { questionMap[q._id.toString()] = q; });

    // Calculate score and build stored question snapshots
    let score = 0;
    const questionSnapshots = questionIds.map((id, index) => {
      const q = questionMap[id.toString()];
      const chosen = answers[index] ?? -1;
      if (q && chosen === q.correctIndex) score++;
      return {
        questionId: q?._id,
        text: q?.text,
        options: q?.options,
        correctIndex: q?.correctIndex,
        subject: q?.subject,
      };
    });

    const attempt = await Attempt.create({
      userId: req.user.id,
      questions: questionSnapshots,
      answers,
      score,
      timeTaken: timeTaken ?? 0,
    });

    res.status(201).json({ attemptId: attempt._id, score });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/attempts/history — user's past attempts (summary)
router.get('/history', auth, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .select('score timeTaken createdAt')
      .sort({ createdAt: -1 });

    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/attempts/:id — full detail of one attempt (for result page)
router.get('/:id', auth, async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id);

    if (!attempt)
      return res.status(404).json({ message: 'Attempt not found' });

    if (attempt.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Forbidden' });

    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
