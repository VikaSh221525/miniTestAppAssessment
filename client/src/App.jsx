import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Admin from './pages/Admin';
import History from './pages/History';
import Home from './pages/Home';
import Login from './pages/Login';
import Result from './pages/Result';
import Signup from './pages/Signup';
import Test from './pages/Test';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" replace /> : <Signup />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        {/* Student-only routes — admins get redirected to /admin */}
        <Route path="/test" element={<ProtectedRoute studentOnly><Test /></ProtectedRoute>} />
        <Route path="/result/:id" element={<ProtectedRoute studentOnly><Result /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute studentOnly><History /></ProtectedRoute>} />

        {/* Admin-only route */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
