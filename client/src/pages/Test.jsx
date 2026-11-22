import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';

const TOTAL_SECONDS = 10 * 60;

export default function Test() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { 0: 2, 1: -1, ... }
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const startTimeRef = useRef(Date.now());
  const submittedRef = useRef(false);

  useEffect(() => {
    api.get('/questions')
      .then(({ data }) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      });
  }, []);

  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [current]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const { data } = await api.post('/attempts', {
        questionIds: questions.map((q) => q._id),
        answers,
        timeTaken,
      });
      navigate(`/result/${data.attemptId}`);
    } catch {
      setError('Failed to submit. Please try again.');
      submittedRef.current = false;
      setSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="alert alert-error max-w-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-base-content/60">
            {answeredCount} of {questions.length} answered
          </span>
          <div className="flex items-center gap-2 border border-base-300 bg-base-100 rounded px-3 py-1">
            <span className="text-xs text-base-content/50">Time left</span>
            <Timer onExpire={handleSubmit} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-base-300 rounded-full h-1.5 mb-6">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question card */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <QuestionCard
              question={questions[current]}
              questionNumber={current + 1}
              total={questions.length}
              selectedAnswer={answers[current] ?? null}
              onSelect={handleSelect}
            />

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-base-200">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setCurrent((c) => c - 1)}
                disabled={current === 0}
              >
                ← Prev
              </button>

              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-7 h-7 text-xs rounded border
                      ${i === current ? 'border-primary bg-primary text-primary-content' : ''}
                      ${answers[i] !== undefined && i !== current ? 'border-base-content/30 bg-base-200' : ''}
                      ${answers[i] === undefined && i !== current ? 'border-base-300' : ''}
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              {current < questions.length - 1 ? (
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setCurrent((c) => c + 1)}
                >
                  Next →
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting
                    ? <span className="loading loading-spinner loading-xs"></span>
                    : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
