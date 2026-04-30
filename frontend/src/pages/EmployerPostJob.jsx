import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-8qgg.onrender.com/api';
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

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

export default function EmployerPostJob() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');
  const token = localStorage.getItem('joblyhubToken');

  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    jobType: '',
    salary: '',
    deadline: '',

    companyName: user.companyName || '',
    industry: user.companyIndustry || '',
    companyWebsite: user.companyWebsite || '',
    companyDescription: user.companyDescription || '',

    description: '',
    responsibilities: '',
    requirements: '',

    applicationMethod: 'email',
    applicationEmail: user.email || '',
    applicationLink: '',
    applicationInstructions: '',

    contactName: user.name || '',
    contactEmail: user.email || '',
    contactPhone: user.phone || '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitJob = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Please login as an employer before posting a job.');
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/jobs`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/employer/dashboard');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Failed to submit job. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-top">
            <div>
              <span>Employer</span>
              <h1>Post a new job</h1>
              <p>
                Submit job details for admin review. Approved jobs will appear
                on JoblyHub publicly.
              </p>
            </div>

            <Link to="/employer/dashboard" className="btn btn-ghost">
              Back to Dashboard
            </Link>
          </div>

          <div className="auth-card wide-card dashboard-form-card">
            {message && <p className="form-message error-text">{message}</p>}

            <form className="auth-form" onSubmit={submitJob}>
              <div className="form-section-title">1. Basic Job Information</div>

              <label>
                Job Title
                <input
                  name="title"
                  value={form.title}
                  onChange={updateForm}
                  placeholder="e.g. Backend Developer"
                  required
                />
              </label>

              <div className="form-grid two">
                <label>
                  Category
                  <select
                    name="category"
                    value={form.category}
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

                <label>
                  Job Type
                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={updateForm}
                    required
                  >
                    <option value="">Select job type</option>
                    {jobTypes.map((type) => (
                      <option value={type} key={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

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
                  Salary
                  <input
                    name="salary"
                    value={form.salary}
                    onChange={updateForm}
                    placeholder="e.g. GHS 3,000 - GHS 5,000"
                  />
                </label>
              </div>

              <label>
                Deadline
                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={updateForm}
                />
              </label>

              <div className="form-section-title">2. Company Information</div>

              <div className="form-grid two">
                <label>
                  Company Name
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={updateForm}
                    required
                  />
                </label>

                <label>
                  Industry
                  <select
                    name="industry"
                    value={form.industry}
                    onChange={updateForm}
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
                  placeholder="Short company description"
                />
              </label>

              <div className="form-section-title">3. Job Details</div>

              <label>
                Job Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  placeholder="Describe the role"
                  required
                />
              </label>

              <label>
                Responsibilities
                <textarea
                  name="responsibilities"
                  value={form.responsibilities}
                  onChange={updateForm}
                  placeholder="List key responsibilities"
                />
              </label>

              <label>
                Requirements
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={updateForm}
                  placeholder="List job requirements"
                />
              </label>

              <div className="form-section-title">4. How to Apply</div>

              <label>
                Application Method
                <select
                  name="applicationMethod"
                  value={form.applicationMethod}
                  onChange={updateForm}
                  required
                >
                  <option value="email">Email</option>
                  <option value="link">External Link</option>
                  <option value="platform">Platform</option>
                </select>
              </label>

              {form.applicationMethod === 'email' && (
                <label>
                  Application Email
                  <input
                    type="email"
                    name="applicationEmail"
                    value={form.applicationEmail}
                    onChange={updateForm}
                    placeholder="hr@example.com"
                    required
                  />
                </label>
              )}

              {form.applicationMethod === 'link' && (
                <label>
                  Application Link
                  <input
                    name="applicationLink"
                    value={form.applicationLink}
                    onChange={updateForm}
                    placeholder="https://example.com/apply"
                    required
                  />
                </label>
              )}

              <label>
                Application Instructions
                <textarea
                  name="applicationInstructions"
                  value={form.applicationInstructions}
                  onChange={updateForm}
                  placeholder="Tell applicants how to apply"
                />
              </label>

              <div className="form-section-title">
                5. Employer Contact Details
              </div>

              <div className="form-grid two">
                <label>
                  Contact Name
                  <input
                    name="contactName"
                    value={form.contactName}
                    onChange={updateForm}
                    placeholder="Contact person"
                  />
                </label>

                <label>
                  Contact Email
                  <input
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={updateForm}
                    placeholder="contact@example.com"
                  />
                </label>
              </div>

              <label>
                Contact Phone
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={updateForm}
                  placeholder="Phone number"
                />
              </label>

              <button className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? 'Submitting job...' : 'Submit Job for Review'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}