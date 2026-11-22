import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4">
      <div className="flex-1">
        <Link to={user?.isAdmin ? '/admin' : '/'} className="text-base font-semibold tracking-tight">
          Mini Test App
        </Link>
      </div>

      {user && (
        <div className="flex-none flex items-center gap-4">
          <span className="text-sm text-base-content/60 hidden sm:block">{user.email}</span>

          {/* Student links */}
          {!user.isAdmin && (
            <>
              <Link to="/history" className="btn btn-ghost btn-sm">History</Link>
            </>
          )}

          {/* Admin badge — no extra nav links needed, sidebar handles it */}
          {user.isAdmin && (
            <span className="badge badge-primary badge-sm">Admin</span>
          )}

          <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
        </div>
      )}
    </div>
  );
}
