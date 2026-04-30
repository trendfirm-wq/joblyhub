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

const experienceLevels = ['Entry Level', 'Junior', 'Mid-Level', 'Senior'];

export default function JobSeekerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    preferredJobCategory: '',
    highestQualification: '',
    experienceLevel: '',
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
        role: 'job_seeker',
      });

      localStorage.setItem('joblyhubToken', res.data.token);
      localStorage.setItem('joblyhubUser', JSON.stringify(res.data));

      navigate('/job-seeker/dashboard');
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
          <span>Job seeker registration</span>
          <h1>Create job seeker account</h1>
          <p>Quick signup so you can start applying for jobs on JoblyHub.</p>
        </div>

        {message && <p className="form-message error-text">{message}</p>}

        <form className="auth-form" onSubmit={submitForm}>
          <div className="form-section-title">Personal Information</div>

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
              required
            />
          </label>

          <div className="form-section-title">Basic Profile</div>

          <div className="form-grid two">
            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={updateForm}
                placeholder="Accra, Ghana"
                required
              />
            </label>

            <label>
              Preferred Job Category
              <select
                name="preferredJobCategory"
                value={form.preferredJobCategory}
                onChange={updateForm}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option value={cat} key={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-section-title">Career Information</div>

          <div className="form-grid two">
            <label>
              Highest Qualification
              <input
                name="highestQualification"
                value={form.highestQualification}
                onChange={updateForm}
                placeholder="e.g. Bachelor's Degree"
                required
              />
            </label>

            <label>
              Experience Level
              <select
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={updateForm}
                required
              >
                <option value="">Select experience level</option>
                {experienceLevels.map((level) => (
                  <option value={level} key={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Upload CV / Resume
            <input type="file" disabled />
            <small className="field-note">
              CV upload will be connected later.
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
            {loading ? 'Creating account...' : 'Create Job Seeker Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </main>
  );
}