import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RichTextEditor from '../components/RichTextEditor';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

const categories = [
  'Technology & IT',
  'Business & Administration',
  'Sales & Marketing',
  'Engineering & Technical',
  'Healthcare & Medical',
  'Education & Training',
  'Customer Service & Support',
  'Transport & Logistics',
  'Skilled Trades & Artisans',
  'Hospitality & Tourism',
  'Finance & Accounting',
  'Human Resources & Recruitment',
  'Legal & Compliance',
  'Creative & Design',
  'Media & Communications',
  'Security Services',
  'Agriculture & Farming',
  'Construction & Real Estate',
  'Project Management',
  'General & Other Jobs',
];

const industries = [
  'Technology & Software',
  'Telecommunications',
  'Banking & Financial Services',
  'Insurance',
  'Accounting & Audit',
  'Manufacturing & Production',
  'Construction & Infrastructure',
  'Real Estate & Property',
  'Retail & E-commerce',
  'Wholesale & Distribution',
  'Transportation & Logistics',
  'Energy & Utilities (Oil, Gas, Power)',
  'Mining & Natural Resources',
  'Agriculture & Agribusiness',
  'Healthcare & Pharmaceuticals',
  'Education & Training',
  'Hospitality & Tourism',
  'Media & Entertainment',
  'Marketing & Advertising',
  'Consulting & Professional Services',
  'Legal Services',
  'Government & Public Sector',
  'NGO & Non-Profit',
  'Security Services',
  'Automotive Industry',
  'Environmental & Waste Management',
  'Import & Export / Trading',
  'Human Resources Services',
  'Research & Development',
  'Other Industries',
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
    additionalInformation: '',

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    return new Date(dateValue).toISOString().split('T')[0];
  };

  const normalizeApplicationMethod = (method) => {
    if (method === 'link') return 'website';
    if (method === 'platform') return 'joblyhub';
    return method || 'email';
  };

  const normalizeCategory = (category) => {
    if (categories.includes(category)) return category;

    const oldCategoryMap = {
      'Business, Administration & Customer Service':
        'Business & Administration',
      'Skilled Trades': 'Skilled Trades & Artisans',
      'Hospitality, Travel & Services': 'Hospitality & Tourism',
      'NGO & Development': 'General & Other Jobs',
    };

    return oldCategoryMap[category] || '';
  };

  const normalizeIndustry = (industry) => {
    if (industries.includes(industry)) return industry;
    return '';
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
        category: normalizeCategory(res.data.category),
        location: res.data.location || '',
        jobType: res.data.jobType || '',
        salary: res.data.salary || '',
        deadline: formatDateForInput(res.data.deadline),

        companyName: res.data.companyName || '',
        industry: normalizeIndustry(res.data.industry),
        companyWebsite: res.data.companyWebsite || '',
        companyDescription: res.data.companyDescription || '',

        description: res.data.description || '',
        responsibilities: res.data.responsibilities || '',
        requirements: res.data.requirements || '',
        additionalInformation: res.data.additionalInformation || '',

        applicationMethod: normalizeApplicationMethod(
          res.data.applicationMethod
        ),
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

  const updateRichText = (field, html) => {
    setForm((prev) => ({
      ...prev,
      [field]: html,
    }));
  };

  const validateForm = () => {
    if (
      !form.title.trim() ||
      !form.category ||
      !form.location.trim() ||
      !form.jobType ||
      !form.companyName.trim() ||
      !form.description.trim() ||
      !form.applicationMethod
    ) {
      setMessage(
        'Please provide title, category, location, job type, company name, job description and application method.'
      );
      return false;
    }

    if (form.applicationMethod === 'email' && !form.applicationEmail.trim()) {
      setMessage('Application email is required.');
      return false;
    }

    if (form.applicationMethod === 'website' && !form.applicationLink.trim()) {
      setMessage('Application website link is required.');
      return false;
    }

    return true;
  };

  const updateJob = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Please login again before editing this job.');
      return;
    }

    if (!validateForm()) return;

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
        error.response?.data?.message ||
          'Failed to update job. Please try again.'
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
                    placeholder="e.g. GHS 1,500 or Negotiable"
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
                    {industries.map((industry) => (
                      <option value={industry} key={industry}>
                        {industry}
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
                <RichTextEditor
                  value={form.companyDescription}
                  onChange={(html) => updateRichText('companyDescription', html)}
                  placeholder="Describe the company"
                />
              </label>

              <div className="form-section-title">3. Job Details</div>

              <label>
                Job Description
                <RichTextEditor
                  value={form.description}
                  onChange={(html) => updateRichText('description', html)}
                  placeholder="Describe the job clearly"
                />
              </label>

              <label>
                Responsibilities
                <RichTextEditor
                  value={form.responsibilities}
                  onChange={(html) => updateRichText('responsibilities', html)}
                  placeholder="List the main responsibilities"
                />
              </label>

              <label>
                Requirements
                <RichTextEditor
                  value={form.requirements}
                  onChange={(html) => updateRichText('requirements', html)}
                  placeholder="List the requirements"
                />
              </label>

              <label>
                Application Instructions
                <RichTextEditor
                  value={form.applicationInstructions}
                  onChange={(html) =>
                    updateRichText('applicationInstructions', html)
                  }
                  placeholder="Tell applicants how to apply"
                />
              </label>

              <label>
                Additional Information
                <RichTextEditor
                  value={form.additionalInformation}
                  onChange={(html) =>
                    updateRichText('additionalInformation', html)
                  }
                  placeholder="Add benefits, working hours, interview notes, or other useful details"
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
                  <option value="website">Website</option>
                  <option value="joblyhub">Through JoblyHub</option>
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

              {form.applicationMethod === 'website' && (
                <label>
                  Application Website
                  <input
                    name="applicationLink"
                    value={form.applicationLink}
                    onChange={updateForm}
                    required
                    placeholder="https://example.com/apply"
                  />
                </label>
              )}

              {form.applicationMethod === 'joblyhub' && (
                <div className="joblyhub-apply-note">
                  <strong>Through JoblyHub</strong>
                  <p>
                    Job seekers will apply directly on JoblyHub by entering
                    their full name, email, and uploading their cover letter,
                    CV, or resume as one PDF document.
                  </p>
                </div>
              )}

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