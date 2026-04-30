import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const categories = [
  'Technology & IT',
  'Business, Administration & Customer Service',
  'Sales & Marketing',
  'Finance & Accounting',
  'Engineering & Technical',
  'Healthcare & Medical',
  'Education & Training',
  'Transport & Logistics',
  'Skilled Trades',
  'Hospitality, Travel & Services',
  'Creative & Design',
  'NGO & Development',
];

export default function EmployerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    companyIndustry: '',
    companyWebsite: '',
    companyDescription: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const updateForm = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setMessage('');

    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (!form.agreedToTerms) {
      setMessage('Please agree to the Terms of Use and Privacy Policy.');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API_URL}/auth/register`, {
        ...form,
        role: 'employer',
      });

      localStorage.setItem('joblyhubToken', res.data.token);
      localStorage.setItem('joblyhubUser', JSON.stringify(res.data));

      navigate('/employer/dashboard');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card wide-card">
        <div className="auth-heading">
          <span>Employer registration</span>
          <h1>Create employer account</h1>
          <p>Quick signup so you can start posting jobs on JoblyHub.</p>
        </div>

        {message && <p className="form-message error-text">{message}</p>}

        <form className="auth-form" onSubmit={submitForm}>
          <div className="form-section-title">Basic Information</div>

          <div className="form-grid two">
            <label>
              Full Name
              <input
                name="name"
                value={form.name}
                onChange={updateForm}
                placeholder="Enter full name"
                required
              />
            </label>

            <label>
              Email Address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={updateForm}
                placeholder="Enter email address"
                required
              />
            </label>
          </div>

          <label>
            Phone Number
            <input
              name="phone"
              value={form.phone}
              onChange={updateForm}
              placeholder="Enter phone number"
            />
          </label>

          <div className="form-section-title">Company Information</div>

          <div className="form-grid two">
            <label>
              Company Name
              <input
                name="companyName"
                value={form.companyName}
                onChange={updateForm}
                placeholder="Enter company name"
                required
              />
            </label>

            <label>
              Company Industry
              <select
                name="companyIndustry"
                value={form.companyIndustry}
                onChange={updateForm}
                required
              >
                <option value="">Select industry</option>
                {categories.map((cat) => (
                  <option value={cat} key={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Company Website
            <input
              name="companyWebsite"
              value={form.companyWebsite}
              onChange={updateForm}
              placeholder="https://example.com"
            />
          </label>

          <label>
            Company Description
            <textarea
              name="companyDescription"
              value={form.companyDescription}
              onChange={updateForm}
              placeholder="Short description about the company"
            />
          </label>

          <label>
            Company Logo
            <input type="file" disabled />
            <small className="field-note">
              Logo upload will be connected later.
            </small>
          </label>

          <div className="form-section-title">Account Setup</div>

          <div className="form-grid two">
            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={updateForm}
                placeholder="Create password"
                required
                minLength="6"
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={updateForm}
                placeholder="Confirm password"
                required
                minLength="6"
              />
            </label>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={form.agreedToTerms}
              onChange={updateForm}
            />
            <span>I agree to the Terms of Use and Privacy Policy</span>
          </label>

          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Employer Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}