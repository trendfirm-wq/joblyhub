import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, UploadCloud } from 'lucide-react';
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

const categories = [
  'Agriculture & Farming',
  'Business & Administration',
  'Construction & Real Estate',
  'Creative & Design',
  'Customer Service & Support',
  'Education & Training',
  'Engineering & Technical',
  'Finance & Accounting',
  'Healthcare & Medical',
  'Hospitality & Tourism',
  'Human Resources & Recruitment',
  'Legal & Compliance',
  'Media & Communications',
  'Mining, Energy & Extractives',
  'Project Management',
  'Sales & Marketing',
  'Security Services',
  'Skilled Trades & Artisans',
  'Technology & IT',
  'Transport & Logistics',
  'General & Other Jobs',
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

  const [cvFile, setCvFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const updateForm = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const updateCv = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage('Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('CV must be less than 5MB.');
      return;
    }

    setMessage('');
    setCvFile(file);
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

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      preferredJobCategory: form.preferredJobCategory,
      highestQualification: form.highestQualification.trim(),
      experienceLevel: form.experienceLevel,
      password: form.password,
      confirmPassword: form.confirmPassword,
      agreedToTerms: form.agreedToTerms,
      role: 'job_seeker',
    };

    const res = await axios.post(`${API_URL}/auth/register`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    localStorage.setItem('joblyhubToken', res.data.token);
    localStorage.setItem('joblyhubUser', JSON.stringify(res.data));

    navigate('/job-seeker/dashboard');
  } catch (error) {
    console.log('REGISTRATION ERROR:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    setMessage(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="auth-page">
      <div className="auth-card wide-card">
        <button
          type="button"
          className="back-icon-only"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>

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
            <div className="logo-upload-box">
              <input
                type="file"
                name="cvFile"
                accept=".pdf,.doc,.docx"
                onChange={updateCv}
              />

              <div>
                <UploadCloud size={28} />
                <span>{cvFile ? cvFile.name : 'Upload CV / Resume'}</span>
                <small>Optional. PDF, DOC, or DOCX. Max size 5MB.</small>
              </div>
            </div>
          </label>

          <div className="form-section-title">Account Setup</div>

          <div className="form-grid two">
            <label>
              Password
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={updateForm}
                  placeholder="Create password"
                  required
                  minLength="6"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            <label>
              Confirm Password
              <div className="password-field">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={updateForm}
                  placeholder="Confirm password"
                  required
                  minLength="6"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
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