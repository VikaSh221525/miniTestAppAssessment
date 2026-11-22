import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', {
        email: form.email,
        password: form.password,
      });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 w-full max-w-sm border border-base-300">
        <div className="card-body gap-4">
          <div className="mb-2">
            <h1 className="text-xl font-semibold">Mini Test App</h1>
            <p className="text-sm text-base-content/60 mt-1">Create your account</p>
          </div>

          {error && (
            <div className="alert alert-error py-2 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered input-sm"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered input-sm"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-sm">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirm"
                className="input input-bordered input-sm"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-sm mt-2"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center text-base-content/60">
            Already have an account?{' '}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
