import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ArrowLeft,
  Banknote,
  Bookmark,
  Briefcase,
  CalendarDays,
  Copy,
  FileText,
  Laptop,
  Link as LinkIcon,
  MapPin,
  Send,
  Tag,
  UploadCloud,
  X,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [savingJob, setSavingJob] = useState(false);

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [applicationFileMode, setApplicationFileMode] = useState('saved');
  const [loadingResumes, setLoadingResumes] = useState(false);

  const user = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');
  const token = localStorage.getItem('joblyhubToken');

  const [applicationForm, setApplicationForm] = useState({
    fullName: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    pdf: null,
  });

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoadingJob(true);

      const res = await axios.get(`${API_URL}/jobs/${id}`);

      setJob(res.data);
      setError('');
    } catch (err) {
      setError('Unable to load this job. It may not be approved or available.');
    } finally {
      setLoadingJob(false);
    }
  };

  const fetchMyResumes = async () => {
    if (!token) return;

    try {
      setLoadingResumes(true);

      const res = await axios.get(`${API_URL}/resumes/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resumeList = res.data || [];
      setResumes(resumeList);

      const defaultResume = resumeList.find((resume) => resume.isDefault);
      const firstResume = resumeList[0];

      if (defaultResume) {
        setSelectedResumeId(defaultResume._id);
        setApplicationFileMode('saved');
      } else if (firstResume) {
        setSelectedResumeId(firstResume._id);
        setApplicationFileMode('saved');
      } else {
        setSelectedResumeId('');
        setApplicationFileMode('upload');
      }
    } catch (error) {
      setApplicationFileMode('upload');
      setSelectedResumeId('');
    } finally {
      setLoadingResumes(false);
    }
  };

  const openApplyModal = () => {
    setActionMessage('');
    setApplyModalOpen(true);
    fetchMyResumes();
  };

  const closeApplyModal = () => {
    setApplyModalOpen(false);
    setActionMessage('');
  };

  const renderHtml = (html) => {
    return { __html: html || '<p>Not provided</p>' };
  };

  const formatSalary = (salary) => {
    if (!salary || salary.trim() === '') return 'Not specified';

    const cleanSalary = salary.trim();

    const alreadyHasCurrency =
      cleanSalary.toLowerCase().includes('ghs') ||
      cleanSalary.toLowerCase().includes('₵') ||
      cleanSalary.toLowerCase().includes('negotiable') ||
      cleanSalary.toLowerCase().includes('n/a') ||
      cleanSalary.toLowerCase().includes('not specified');

    if (alreadyHasCurrency) return cleanSalary;

    return `GHS ${cleanSalary}`;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Not specified';

    return new Date(dateValue).toLocaleDateString();
  };

  const getWorkType = (jobData) => {
    if (jobData.workType) return jobData.workType;

    if (jobData.jobType === 'Remote') return 'Remote';

    return 'Not specified';
  };

  const saveJob = async () => {
    setActionMessage('');

    if (!token) {
      setActionMessage('Please login as a job seeker to save this job.');
      return;
    }

    try {
      setSavingJob(true);

      await axios.post(
        `${API_URL}/saved-jobs/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setActionMessage('Job saved successfully.');
    } catch (error) {
      setActionMessage(
        error.response?.data?.message || 'Unable to save this job.'
      );
    } finally {
      setSavingJob(false);
    }
  };

  const copyEmail = async () => {
    setActionMessage('');

    if (!job?.applicationEmail) {
      setActionMessage('No application email provided.');
      return;
    }

    try {
      await navigator.clipboard.writeText(job.applicationEmail);
      setActionMessage('Application email copied.');
    } catch (error) {
      setActionMessage(`Application email: ${job.applicationEmail}`);
    }
  };

  const openWebsite = () => {
    setActionMessage('');

    if (!job?.applicationLink) {
      setActionMessage('No application website provided.');
      return;
    }

    const finalUrl =
      job.applicationLink.startsWith('http://') ||
      job.applicationLink.startsWith('https://')
        ? job.applicationLink
        : `https://${job.applicationLink}`;

    window.open(finalUrl, '_blank', 'noopener,noreferrer');
  };

  const updateApplicationForm = (e) => {
    const { name, value } = e.target;

    setApplicationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePdf = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setActionMessage('Please upload one PDF document only.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setActionMessage('PDF must be less than 5MB.');
      return;
    }

    setActionMessage('');

    setApplicationForm((prev) => ({
      ...prev,
      pdf: file,
    }));
  };

  const submitJoblyHubApplication = async (e) => {
    e.preventDefault();
    setActionMessage('');

    if (!token) {
      setActionMessage('Please login as a job seeker before applying.');
      return;
    }

    if (user.role !== 'job_seeker' && user.role !== 'admin') {
      setActionMessage('Only job seeker accounts can apply through JoblyHub.');
      return;
    }

    if (!applicationForm.fullName.trim()) {
      setActionMessage('Please enter your full name.');
      return;
    }

    if (!applicationForm.email.trim()) {
      setActionMessage('Please enter your email address.');
      return;
    }

    const selectedResume = resumes.find(
      (resume) => resume._id === selectedResumeId
    );

    if (applicationFileMode === 'saved' && !selectedResume) {
      setActionMessage('Please select a saved resume or upload a new PDF.');
      return;
    }

    if (applicationFileMode === 'upload' && !applicationForm.pdf) {
      setActionMessage(
        'Please upload your cover letter and CV/resume as one PDF document.'
      );
      return;
    }

    try {
      setApplying(true);

      const formData = new FormData();

      formData.append('fullName', applicationForm.fullName);
      formData.append('email', applicationForm.email);
      formData.append('phone', applicationForm.phone || '');

      if (applicationFileMode === 'saved') {
        formData.append('resumeLink', selectedResume.fileUrl);
      }

      if (applicationFileMode === 'upload') {
        formData.append('applicationPdf', applicationForm.pdf);
      }

      await axios.post(`${API_URL}/applications/${id}/apply`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 60000,
      });

      setApplyModalOpen(false);
      setActionMessage('Application submitted successfully.');

      setApplicationForm({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        pdf: null,
      });

      setSelectedResumeId('');
      setApplicationFileMode('saved');
    } catch (error) {
      setActionMessage(
        error.response?.data?.message || 'Unable to submit application.'
      );
    } finally {
      setApplying(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="site">
        <PageTitle title="Job Details" />
        <Navbar />
        <div className="container page-state">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="site">
        <PageTitle title="Job Details" />
        <Navbar />
        <div className="container page-state error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="site">
      <PageTitle title={job?.title || 'Job Details'} />
      <Navbar />

      <main className="details-page">
        <div className="container">
          <Link to="/jobs" className="back-link">
            <ArrowLeft size={18} />
            Back to jobs
          </Link>

          <div className="details-grid">
            <section className="details-main">
              <div className="details-header">
                <div className="job-logo details-logo">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={`${job.companyName || 'Company'} logo`}
                      className="details-company-logo"
                    />
                  ) : (
                    job.companyName?.charAt(0) || 'J'
                  )}
                </div>

                <div>
                  <span className="job-pill">{job.category}</span>
                  <h1>{job.title}</h1>
                  <p>{job.companyName}</p>
                </div>
              </div>

              <div className="premium-job-stats">
                <div className="premium-job-stat-card">
                  <div className="premium-job-stat-icon">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <span>Location</span>
                    <strong>{job.location || 'Not specified'}</strong>
                  </div>
                </div>

                <div className="premium-job-stat-card">
                  <div className="premium-job-stat-icon">
                    <Briefcase size={15} />
                  </div>
                  <div>
                    <span>Job Type</span>
                    <strong>{job.jobType || 'Not specified'}</strong>
                  </div>
                </div>

                <div className="premium-job-stat-card">
                  <div className="premium-job-stat-icon">
                    <Banknote size={15} />
                  </div>
                  <div>
                    <span>Salary</span>
                    <strong>{formatSalary(job.salary)}</strong>
                  </div>
                </div>

                <div className="premium-job-stat-card">
                  <div className="premium-job-stat-icon">
                    <CalendarDays size={15} />
                  </div>
                  <div>
                    <span>Deadline</span>
                    <strong>{formatDate(job.deadline)}</strong>
                  </div>
                </div>

                <div className="premium-job-stat-card">
                  <div className="premium-job-stat-icon">
                    <Tag size={15} />
                  </div>
                  <div>
                    <span>Category</span>
                    <strong>{job.category || 'Uncategorized'}</strong>
                  </div>
                </div>

                
              </div>

              <div className="details-section">
                <h2>Job Description</h2>
                <div
                  className="rich-content"
                  dangerouslySetInnerHTML={renderHtml(job.description)}
                />
              </div>

              {job.companyDescription && (
                <div className="details-section">
                  <h2>About the Company</h2>
                  <div
                    className="rich-content"
                    dangerouslySetInnerHTML={renderHtml(
                      job.companyDescription
                    )}
                  />
                </div>
              )}

              {job.requirements && (
                <div className="details-section">
                  <h2>Requirements</h2>
                  <div
                    className="rich-content"
                    dangerouslySetInnerHTML={renderHtml(job.requirements)}
                  />
                </div>
              )}

              {job.responsibilities && (
                <div className="details-section">
                  <h2>Responsibilities</h2>
                  <div
                    className="rich-content"
                    dangerouslySetInnerHTML={renderHtml(job.responsibilities)}
                  />
                </div>
              )}

              {job.additionalInformation && (
                <div className="details-section">
                  <h2>Additional Information</h2>
                  <div
                    className="rich-content"
                    dangerouslySetInnerHTML={renderHtml(
                      job.additionalInformation
                    )}
                  />
                </div>
              )}

              {job.applicationInstructions && (
                <div className="details-section">
                  <h2>Application Instructions</h2>
                  <div
                    className="rich-content"
                    dangerouslySetInnerHTML={renderHtml(
                      job.applicationInstructions
                    )}
                  />
                </div>
              )}
            </section>

            <aside className="apply-card">
              <h3>Apply for this job</h3>
              <p>
                Review the job details carefully before sending your
                application.
              </p>

              {job.applicationMethod === 'email' && job.applicationEmail && (
                <div className="apply-copy-email-box">
                  <span>Application Email</span>
                  <strong>{job.applicationEmail}</strong>

                  <button
                    type="button"
                    className="btn btn-primary apply-btn"
                    onClick={copyEmail}
                  >
                    <Copy size={18} />
                    Copy Email
                  </button>

                  <small>
                    Copy this email and send your application from your own
                    email account.
                  </small>
                </div>
              )}

              {job.applicationMethod === 'website' && job.applicationLink && (
                <button
                  type="button"
                  className="btn btn-primary apply-btn"
                  onClick={openWebsite}
                >
                  <LinkIcon size={18} />
                  Apply on Website
                </button>
              )}

              {job.applicationMethod === 'joblyhub' && (
                <button
                  type="button"
                  className="btn btn-primary apply-btn"
                  onClick={openApplyModal}
                >
                  <Send size={18} />
                  Apply Now
                </button>
              )}

              <button
                type="button"
                className="btn btn-ghost save-job-btn"
                onClick={saveJob}
                disabled={savingJob}
              >
                <Bookmark size={18} />
                {savingJob ? 'Saving...' : 'Save Job'}
              </button>

              {actionMessage && (
                <p className="action-message">{actionMessage}</p>
              )}

              <div className="apply-info">
                <span>Industry</span>
                <strong>{job.industry || 'Not specified'}</strong>
              </div>

              {job.companyWebsite && (
                <div className="apply-info">
                  <span>Company Website</span>
                  <a href={job.companyWebsite} target="_blank" rel="noreferrer">
                    Visit website
                  </a>
                </div>
              )}

              <div className="apply-info">
                <span>Deadline</span>
                <strong>{formatDate(job.deadline)}</strong>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {applyModalOpen && (
        <div className="joblyhub-apply-backdrop">
          <div className="joblyhub-apply-modal">
            <button
              type="button"
              className="joblyhub-apply-close"
              onClick={closeApplyModal}
            >
              <X size={20} />
            </button>

            <div className="joblyhub-apply-heading">
              <span>Apply Through JoblyHub</span>
              <h2>{job.title}</h2>
            <p>
  Upload your cover letter and CV/resume as one PDF document, or use a saved
  resume you have already uploaded.
</p>
            </div>

            {actionMessage && (
              <p className="form-message error-text">{actionMessage}</p>
            )}

            <form
              className="joblyhub-apply-form"
              onSubmit={submitJoblyHubApplication}
            >
              <label>
                Full Name
                <input
                  name="fullName"
                  value={applicationForm.fullName}
                  onChange={updateApplicationForm}
                  placeholder="Your full name"
                  required
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  name="email"
                  value={applicationForm.email}
                  onChange={updateApplicationForm}
                  placeholder="your@email.com"
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  name="phone"
                  value={applicationForm.phone}
                  onChange={updateApplicationForm}
                  placeholder="Optional phone number"
                />
              </label>

              <div className="apply-resume-choice">
                <span>Application Document</span>

                <div className="apply-resume-tabs">
                  <button
                    type="button"
                    className={applicationFileMode === 'saved' ? 'active' : ''}
                    onClick={() => setApplicationFileMode('saved')}
                    disabled={resumes.length === 0}
                  >
                    Use Saved Resume
                  </button>

                  <button
                    type="button"
                    className={applicationFileMode === 'upload' ? 'active' : ''}
                    onClick={() => setApplicationFileMode('upload')}
                  >
                    Upload New PDF
                  </button>
                </div>

                {loadingResumes && (
                  <p className="form-help-text">Loading your saved resumes...</p>
                )}

                {applicationFileMode === 'saved' && resumes.length > 0 && (
                  <label>
                    Select Resume
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                    >
                      {resumes.map((resume) => (
                        <option value={resume._id} key={resume._id}>
                          {resume.title}
                          {resume.isDefault ? ' — Default' : ''}
                        </option>
                      ))}
                    </select>
                    <small className="form-help-text">
                      Your selected resume will be sent with this application.
                    </small>
                  </label>
                )}

                {applicationFileMode === 'saved' && resumes.length === 0 && (
                  <div className="saved-resume-empty-note">
                    <p>
                      You have no saved resume yet. Upload a PDF below for this
                      application.
                    </p>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setApplicationFileMode('upload')}
                    >
                      Upload PDF Instead
                    </button>
                  </div>
                )}

                {applicationFileMode === 'upload' && (
                  <label>
                    Cover Letter + CV/Resume PDF
                    <div className="joblyhub-pdf-upload">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={updatePdf}
                      />

                      <div>
                        <UploadCloud size={30} />
                        <strong>
                          {applicationForm.pdf
                            ? applicationForm.pdf.name
                            : 'Upload one PDF document'}
                        </strong>
                        <small>
                          Combine your cover letter and CV/resume into one PDF.
                          Maximum size: 5MB.
                        </small>
                      </div>
                    </div>
                  </label>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-btn"
                disabled={applying}
              >
                {applying ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}