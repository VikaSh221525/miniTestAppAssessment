import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function Result() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/attempts/${id}`)
      .then(({ data }) => {
        setAttempt(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load result.');
        setLoading(false);
      });
  }, [id]);

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

  const { score, questions, answers, timeTaken } = attempt;
  const total = questions.length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">

        {/* Score summary */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">Your Score</p>
                <p className="text-3xl font-semibold">{score} <span className="text-base-content/40 text-lg">/ {total}</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">Time Taken</p>
                <p className="text-sm font-medium">{formatTime(timeTaken)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body gap-0 p-0">
            {questions.map((q, index) => {
              const chosen = answers instanceof Map
                ? answers.get(String(index))
                : (answers?.[index] ?? answers?.[String(index)]);
              const isCorrect = chosen === q.correctIndex;
              const wasSkipped = chosen === undefined || chosen === -1 || chosen === null;

              return (
                <div
                  key={index}
                  className={`px-5 py-4 border-b border-base-200 last:border-0
                    ${isCorrect ? 'bg-success/5' : 'bg-error/5'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 text-sm font-semibold ${isCorrect ? 'text-success' : 'text-error'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{q.text}</p>
                      {!isCorrect && (
                        <div className="mt-1.5 flex flex-col gap-0.5">
                          {!wasSkipped && (
                            <p className="text-xs text-error">
                              Your answer: {q.options[chosen]}
                            </p>
                          )}
                          {wasSkipped && (
                            <p className="text-xs text-base-content/50">Not answered</p>
                          )}
                          <p className="text-xs text-success">
                            Correct: {q.options[q.correctIndex]}
                          </p>
                        </div>
                      )}
                      {isCorrect && (
                        <p className="text-xs text-success mt-1">{q.options[q.correctIndex]}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link to="/history" className="btn btn-ghost btn-sm">
            View History
          </Link>
          <Link to="/" className="btn btn-primary btn-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
