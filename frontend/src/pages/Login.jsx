import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.email || !form.password) {
      setMessage('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/login`, form);

      localStorage.setItem('joblyhubToken', res.data.token);
      localStorage.setItem('joblyhubUser', JSON.stringify(res.data));

      if (res.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (res.data.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/job-seeker/dashboard');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="auth-page">
        <div className="auth-card">
          <div className="auth-heading">
            <span>Welcome back</span>
            <h1>Login to JoblyHub</h1>
            <p>Access your dashboard and continue managing opportunities.</p>
          </div>

          {message && <p className="form-message error-text">{message}</p>}

          <form className="auth-form" onSubmit={submitLogin}>
            <label>
              Email Address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateForm}
                placeholder="Enter your email"
                required
              />
            </label>

            <label>
              Password
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={updateForm}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            <button className="btn btn-primary auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/register">Create account</Link>
          </p>
        </div>
      </main>
    </>
  );
}