import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

export default function EmployerEditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('joblyhubToken');
  const currentUser = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');

  const [form, setForm] = useState({
    title: '',
    category: '',
    location: '',
    jobType: '',
    salary: '',
    deadline: '',

    companyName: '',
    industry: '',
    companyWebsite: '',
    companyDescription: '',

    description: '',
    responsibilities: '',
    requirements: '',

    applicationMethod: 'email',
    applicationEmail: '',
    applicationLink: '',
    applicationInstructions: '',

    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const [loadingJob, setLoadingJob] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    return new Date(dateValue).toISOString().split('T')[0];
  };

  const fetchJob = async () => {
    try {
      setLoadingJob(true);

      const res = await axios.get(`${API_URL}/jobs/employer/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setForm({
        title: res.data.title || '',
        category: res.data.category || '',
        location: res.data.location || '',
        jobType: res.data.jobType || '',
        salary: res.data.salary || '',
        deadline: formatDateForInput(res.data.deadline),

        companyName: res.data.companyName || '',
        industry: res.data.industry || '',
        companyWebsite: res.data.companyWebsite || '',
        companyDescription: res.data.companyDescription || '',

        description: res.data.description || '',
        responsibilities: res.data.responsibilities || '',
        requirements: res.data.requirements || '',

        applicationMethod: res.data.applicationMethod || 'email',
        applicationEmail: res.data.applicationEmail || '',
        applicationLink: res.data.applicationLink || '',
        applicationInstructions: res.data.applicationInstructions || '',

        contactName: res.data.contactName || '',
        contactEmail: res.data.contactEmail || '',
        contactPhone: res.data.contactPhone || '',
      });

      setMessage('');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to load this job. Please check your access and try again.'
      );
    } finally {
      setLoadingJob(false);
    }
  };

  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateJob = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Please login again before editing this job.');
      return;
    }

    try {
      setLoading(true);

      await axios.put(`${API_URL}/jobs/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employer/dashboard');
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to update job. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const backPath =
    currentUser.role === 'admin' ? '/admin/dashboard' : '/employer/dashboard';

  if (loadingJob) {
    return (
      <div className="site">
        <Navbar />

        <main className="dashboard-page">
          <div className="container">
            <p className="state-text">Loading job details...</p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-top">
            <div>
              <span>{currentUser.role === 'admin' ? 'Admin' : 'Employer'}</span>
              <h1>Edit job</h1>
              <p>
                Update your job details. If the job was approved, editing it may
                send it back for admin review.
              </p>
            </div>

            <Link to={backPath} className="btn btn-ghost">
              Back to Dashboard
            </Link>
          </div>

          <div className="auth-card wide-card dashboard-form-card">
            {message && <p className="form-message error-text">{message}</p>}

            <form className="auth-form" onSubmit={updateJob}>
              <div className="form-section-title">1. Basic Job Information</div>

              <label>
                Job Title
                <input
                  name="title"
                  value={form.title}
                  onChange={updateForm}
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
                    required
                  />
                </label>

                <label>
                  Salary
                  <input
                    name="salary"
                    value={form.salary}
                    onChange={updateForm}
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
                />
              </label>

              <label>
                Company Description
                <textarea
                  name="companyDescription"
                  value={form.companyDescription}
                  onChange={updateForm}
                />
              </label>

              <div className="form-section-title">3. Job Details</div>

              <label>
                Job Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateForm}
                  required
                />
              </label>

              <label>
                Responsibilities
                <textarea
                  name="responsibilities"
                  value={form.responsibilities}
                  onChange={updateForm}
                />
              </label>

              <label>
                Requirements
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={updateForm}
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
                  />
                </label>

                <label>
                  Contact Email
                  <input
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={updateForm}
                  />
                </label>
              </div>

              <label>
                Contact Phone
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={updateForm}
                />
              </label>

              <button className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? 'Updating job...' : 'Update Job'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}