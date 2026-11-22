import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/attempts/history')
      .then(({ data }) => {
        setAttempts(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load history.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Past Attempts</h1>
          <Link to="/test" className="btn btn-primary btn-sm">
            Take New Test
          </Link>
        </div>

        {error && <div className="alert alert-error text-sm">{error}</div>}

        {attempts.length === 0 ? (
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body items-center text-center py-10">
              <p className="text-base-content/50 text-sm">No attempts yet.</p>
              <Link to="/test" className="btn btn-primary btn-sm mt-2">
                Take your first test
              </Link>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 border border-base-300 overflow-hidden">
            <table className="table table-sm">
              <thead>
                <tr className="border-b border-base-300 bg-base-200">
                  <th className="text-xs font-medium text-base-content/60">#</th>
                  <th className="text-xs font-medium text-base-content/60">Score</th>
                  <th className="text-xs font-medium text-base-content/60">Time Taken</th>
                  <th className="text-xs font-medium text-base-content/60">Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt, i) => (
                  <tr key={attempt._id} className="border-b border-base-200 last:border-0">
                    <td className="text-sm text-base-content/50">{i + 1}</td>
                    <td>
                      <span className={`font-semibold text-sm ${attempt.score >= 7 ? 'text-success' : attempt.score >= 5 ? 'text-warning' : 'text-error'}`}>
                        {attempt.score}/10
                      </span>
                    </td>
                    <td className="text-sm text-base-content/70">{formatTime(attempt.timeTaken)}</td>
                    <td className="text-sm text-base-content/70">{formatDate(attempt.createdAt)}</td>
                    <td>
                      <Link
                        to={`/result/${attempt._id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
