import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  // Admins have no business on the student home — send them to their panel
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 w-full max-w-md border border-base-300">
        <div className="card-body items-center text-center gap-4">
          <h2 className="card-title text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-base-content/60">{user?.email}</p>
          <p className="text-sm text-base-content/70">
            The test consists of 10 multiple-choice questions. You have 10 minutes to complete it.
          </p>
          <div className="card-actions flex-col w-full gap-2 mt-2">
            <Link to="/test" className="btn btn-primary btn-sm w-full">
              Start Test
            </Link>
            <Link to="/history" className="btn btn-ghost btn-sm w-full">
              View History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
