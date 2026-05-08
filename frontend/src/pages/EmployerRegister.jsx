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

  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
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

  const updateLogo = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      setMessage('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage('Logo must be less than 2MB.');
      return;
    }

    setMessage('');
    setCompanyLogo(file);
    setLogoPreview(URL.createObjectURL(file));
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

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append('role', 'employer');

      if (companyLogo) {
        formData.append('companyLogo', companyLogo);
      }

      const res = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
        <button
          type="button"
          className="back-icon-only"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>

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
            <div className="logo-upload-box">
              <input
                type="file"
                name="companyLogo"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={updateLogo}
              />

              <div>
                {logoPreview ? (
                  <img src={logoPreview} alt="Company logo preview" />
                ) : (
                  <UploadCloud size={28} />
                )}

                <span>
                  {companyLogo ? companyLogo.name : 'Upload company logo'}
                </span>

                <small>Optional. PNG, JPG, or WEBP. Max size 2MB.</small>
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
                  className="password-eye-btn"
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
                  className="password-eye-btn"
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