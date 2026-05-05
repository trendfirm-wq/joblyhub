import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
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
    industry: industries.includes(user.companyIndustry) ? user.companyIndustry : '',
    companyWebsite: user.companyWebsite || '',
    companyDescription: user.companyDescription || '',

    description: '',
    responsibilities: '',
    requirements: '',
    additionalInformation: '',

    applicationMethod: 'email',
    applicationEmail: user.email || '',
    applicationLink: '',
    applicationInstructions: '',

    contactName: user.name || '',
    contactEmail: user.email || '',
    contactPhone: user.phone || '',
  });

  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(user.companyLogo || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateRichText = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
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
        'Please provide job title, category, location, job type, company name, job description and application method.'
      );
      return false;
    }

    if (form.applicationMethod === 'email' && !form.applicationEmail.trim()) {
      setMessage('Please provide the email address applicants should copy.');
      return false;
    }

    if (form.applicationMethod === 'website' && !form.applicationLink.trim()) {
      setMessage('Please provide the website link where applicants should apply.');
      return false;
    }

    return true;
  };

  const submitJob = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!token) {
      setMessage('Please login as an employer before posting a job.');
      return;
    }

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (companyLogo) {
        formData.append('companyLogo', companyLogo);
      }

      await axios.post(`${API_URL}/jobs`, formData, {
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
          <div className="dashboard-top post-job-top">
            <div>
              <span>Employer</span>
              <h1>Post a new job</h1>
              <p>
                Submit job details for admin review. Approved jobs will appear
                publicly on JoblyHub.
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
                  onChange={(value) =>
                    updateRichText('companyDescription', value)
                  }
                  placeholder="Short company description"
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
                      {companyLogo
                        ? companyLogo.name
                        : logoPreview
                        ? 'Current company logo'
                        : 'Upload company logo'}
                    </span>

                    <small>Optional. PNG, JPG, or WEBP. Max size 2MB.</small>
                  </div>
                </div>
              </label>

              <div className="form-section-title">3. Job Details</div>

              <label>
                Job Description
                <RichTextEditor
                  value={form.description}
                  onChange={(value) => updateRichText('description', value)}
                  placeholder="Describe the role clearly"
                />
              </label>

              <label>
                Responsibilities
                <RichTextEditor
                  value={form.responsibilities}
                  onChange={(value) =>
                    updateRichText('responsibilities', value)
                  }
                  placeholder="List key responsibilities"
                />
              </label>

              <label>
                Requirements
                <RichTextEditor
                  value={form.requirements}
                  onChange={(value) => updateRichText('requirements', value)}
                  placeholder="List job requirements"
                />
              </label>

              <label>
                Application Instructions
                <RichTextEditor
                  value={form.applicationInstructions}
                  onChange={(value) =>
                    updateRichText('applicationInstructions', value)
                  }
                  placeholder="Add any extra instructions for applicants"
                />
              </label>

              <label>
                Additional Information
                <RichTextEditor
                  value={form.additionalInformation}
                  onChange={(value) =>
                    updateRichText('additionalInformation', value)
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
                    placeholder="hr@example.com"
                    required
                  />
                  <small className="form-help-text">
                    Job seekers will see this email and copy it to apply.
                  </small>
                </label>
              )}

              {form.applicationMethod === 'website' && (
                <label>
                  Application Website
                  <input
                    name="applicationLink"
                    value={form.applicationLink}
                    onChange={updateForm}
                    placeholder="https://example.com/apply"
                    required
                  />
                  <small className="form-help-text">
                    Job seekers will be taken to this website when they click
                    Apply.
                  </small>
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