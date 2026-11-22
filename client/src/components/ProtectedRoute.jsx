import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Routes that admins should never access
const STUDENT_ONLY_PATHS = ['/test', '/history', '/result'];

export default function ProtectedRoute({ children, adminOnly = false, studentOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Admin trying to access a student-only route
  if (studentOnly && user.isAdmin) return <Navigate to="/admin" replace />;

  // Non-admin trying to access admin-only route
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;

  return children;
}
