import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Briefcase,
  CalendarDays,
  Download,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
  RefreshCcw,
  Save,
  User,
  Users,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

const applicationStatuses = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'hired', label: 'Hired' },
  { value: 'not_selected', label: 'Not Selected' },
  { value: 'rejected', label: 'Rejected' },
];

const interviewMethods = [
  { value: '', label: 'No interview method' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'in_person', label: 'In Person' },
  { value: 'online', label: 'Online Meeting' },
];

export default function EmployerApplications() {
  const token = localStorage.getItem('joblyhubToken');

  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [message, setMessage] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [downloadingId, setDownloadingId] = useState('');
  const [draftUpdates, setDraftUpdates] = useState({});

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);

      const res = await axios.get(`${API_URL}/applications/employer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data || []);
      setMessage('');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to load applications. Please login again.'
      );
    } finally {
      setLoadingApplications(false);
    }
  };

  const getDraft = (application) => {
    return (
      draftUpdates[application._id] || {
        status: application.status || 'submitted',
        employerNote: application.employerNote || '',
        interviewDate: application.interviewDate
          ? new Date(application.interviewDate).toISOString().slice(0, 16)
          : '',
        interviewMethod: application.interviewMethod || '',
        interviewLocation: application.interviewLocation || '',
      }
    );
  };

  const updateDraft = (applicationId, field, value) => {
    setDraftUpdates((prev) => ({
      ...prev,
      [applicationId]: {
        ...(prev[applicationId] || {}),
        [field]: value,
      },
    }));
  };

  const saveApplicationUpdate = async (application) => {
    const draft = getDraft(application);

    try {
      setUpdatingId(application._id);

      const res = await axios.put(
        `${API_URL}/applications/${application._id}/status`,
        {
          status: draft.status,
          employerNote: draft.employerNote || '',
          interviewDate: draft.interviewDate || '',
          interviewMethod: draft.interviewMethod || '',
          interviewLocation: draft.interviewLocation || '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === application._id
            ? {
                ...app,
                ...res.data.application,
                job: app.job,
                applicant: app.applicant,
              }
            : app
        )
      );

      setDraftUpdates((prev) => {
        const next = { ...prev };
        delete next[application._id];
        return next;
      });

      setMessage('Application updated successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to update application status.'
      );
    } finally {
      setUpdatingId('');
    }
  };

  const quickUpdateStatus = async (application, status) => {
    try {
      setUpdatingId(application._id);

      const res = await axios.put(
        `${API_URL}/applications/${application._id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === application._id
            ? {
                ...app,
                ...res.data.application,
                job: app.job,
                applicant: app.applicant,
              }
            : app
        )
      );

      setMessage('Application status updated successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to update application status.'
      );
    } finally {
      setUpdatingId('');
    }
  };

  const cleanFileName = (name = 'Applicant') => {
    return name
      .replace(/[^a-z0-9]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const downloadPdf = async (application) => {
    if (!application.applicationPdfUrl) {
      setMessage('No PDF document found for this application.');
      return;
    }

    try {
      setDownloadingId(application._id);
      setMessage('');

      const response = await fetch(application.applicationPdfUrl);

      if (!response.ok) {
        throw new Error('Unable to download PDF.');
      }

      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `${cleanFileName(
        application.fullName
      )}-JoblyHub-Application.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(
        'Unable to download the PDF directly. Please open it in a new tab instead.'
      );
    } finally {
      setDownloadingId('');
    }
  };

  const openPdfPreview = (pdfUrl) => {
    if (!pdfUrl) {
      setMessage('No PDF document found for this application.');
      return;
    }

    const viewerUrl = `https://docs.google.com/gview?embedded=false&url=${encodeURIComponent(
      pdfUrl
    )}`;

    window.open(viewerUrl, '_blank', 'noopener,noreferrer');
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Not set';
    return new Date(dateValue).toLocaleString();
  };

  const stats = useMemo(() => {
    return {
      total: applications.length,
      submitted: applications.filter((app) => app.status === 'submitted')
        .length,
      reviewed: applications.filter((app) => app.status === 'reviewed').length,
      shortlisted: applications.filter((app) => app.status === 'shortlisted')
        .length,
      hired: applications.filter((app) => app.status === 'hired').length,
    };
  }, [applications]);

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-top employer-top">
            <div>
              <span>Employer Applications</span>
              <h1>Job submissions</h1>
              <p>
                Review applicants, open their PDF documents, add interview
                details, and update their application status.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-ghost dash-action"
              onClick={fetchApplications}
            >
              <RefreshCcw size={18} />
              Refresh
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={22} />
              </div>
              <div>
                <strong>{stats.total}</strong>
                <span>Total Submissions</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                <Briefcase size={22} />
              </div>
              <div>
                <strong>{stats.submitted}</strong>
                <span>New Submissions</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon approved">
                <User size={22} />
              </div>
              <div>
                <strong>{stats.reviewed}</strong>
                <span>Reviewed</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon approved">
                <Briefcase size={22} />
              </div>
              <div>
                <strong>{stats.shortlisted}</strong>
                <span>Shortlisted</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon approved">
                <Users size={22} />
              </div>
              <div>
                <strong>{stats.hired}</strong>
                <span>Hired</span>
              </div>
            </div>
          </div>

          <section className="dashboard-panel employer-applications-panel">
            <div className="panel-heading">
              <div>
                <span>Applications</span>
                <h2>Applicants from your jobs</h2>
              </div>
            </div>

            {message && <p className="form-message">{message}</p>}

            {loadingApplications && (
              <p className="state-text">Loading applications...</p>
            )}

            {!loadingApplications && applications.length === 0 && (
              <div className="empty-state">
                <h3>No submissions yet</h3>
                <p>
                  When job seekers apply through JoblyHub, their submissions
                  will appear here.
                </p>
              </div>
            )}

            {!loadingApplications && applications.length > 0 && (
              <div className="employer-applications-grid">
                {applications.map((application) => {
                  const draft = getDraft(application);

                  return (
                    <article
                      className="employer-application-card premium-employer-application"
                      key={application._id}
                    >
                      <div className="application-card-top">
                        <div className="application-avatar">
                          {application.fullName?.charAt(0) || 'A'}
                        </div>

                        <div>
                          <span
                            className={`status-badge ${
                              application.status || 'submitted'
                            }`}
                          >
                            {application.status || 'submitted'}
                          </span>
                          <h3>{application.fullName}</h3>
                          <p>{application.job?.title || 'Job not available'}</p>
                        </div>
                      </div>

                      <div className="application-contact-list">
  <span>
    <Mail size={15} />
    {application.email}
  </span>

  {application.phone && (
    <span>
      <Phone size={15} />
      {application.phone}
    </span>
  )}

  <span>
    <Briefcase size={15} />
    {application.job?.companyName || 'Company'}
  </span>
</div>

<div className="applicant-profile-box">
  <span>Applicant Profile</span>

  <div className="applicant-profile-grid">
    <div>
      <small>Location</small>
      <strong>{application.applicant?.location || 'Not provided'}</strong>
    </div>

    <div>
      <small>Preferred Category</small>
      <strong>
        {application.applicant?.preferredJobCategory || 'Not provided'}
      </strong>
    </div>

    <div>
      <small>Qualification</small>
      <strong>
        {application.applicant?.highestQualification || 'Not provided'}
      </strong>
    </div>

    <div>
      <small>Experience Level</small>
      <strong>
        {application.applicant?.experienceLevel || 'Not provided'}
      </strong>
    </div>
  </div>
</div>

                      <div className="application-detail-box">
                        <span>Job Details</span>
                        <strong>
                          {application.job?.title || 'Not provided'}
                        </strong>
                        <p>
                          {application.job?.category || 'No category'} •{' '}
                          {application.job?.location || 'No location'} •{' '}
                          {application.job?.jobType || 'No type'}
                        </p>
                      </div>

                      {application.applicationPdfUrl ? (
                        <div className="application-pdf-actions">
                          <button
                            type="button"
                            className="application-download-btn"
                            onClick={() => downloadPdf(application)}
                            disabled={downloadingId === application._id}
                          >
                            <Download size={17} />
                            {downloadingId === application._id
                              ? 'Downloading...'
                              : 'Download PDF'}
                          </button>

                          <button
                            type="button"
                            className="application-open-btn"
                            onClick={() =>
                              openPdfPreview(application.applicationPdfUrl)
                            }
                          >
                            <ExternalLink size={17} />
                            Open in Google Viewer
                          </button>
                        </div>
                      ) : application.resumeLink ? (
                        <a
                          href={application.resumeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="application-download-btn"
                        >
                          <ExternalLink size={17} />
                          View Resume Link
                        </a>
                      ) : (
                        <p className="application-no-pdf">
                          No PDF document attached.
                        </p>
                      )}

                      <div className="application-update-box">
                        <div className="form-grid two">
                          <label>
                            Status
                            <select
                              value={draft.status}
                              onChange={(e) =>
                                updateDraft(
                                  application._id,
                                  'status',
                                  e.target.value
                                )
                              }
                            >
                              {applicationStatuses.map((status) => (
                                <option
                                  key={status.value}
                                  value={status.value}
                                >
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            Interview Method
                            <select
                              value={draft.interviewMethod}
                              onChange={(e) =>
                                updateDraft(
                                  application._id,
                                  'interviewMethod',
                                  e.target.value
                                )
                              }
                            >
                              {interviewMethods.map((method) => (
                                <option
                                  key={method.value}
                                  value={method.value}
                                >
                                  {method.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <label>
                          Interview Date
                          <div className="input-with-icon">
                            <CalendarDays size={16} />
                            <input
                              type="datetime-local"
                              value={draft.interviewDate}
                              onChange={(e) =>
                                updateDraft(
                                  application._id,
                                  'interviewDate',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </label>

                        <label>
                          Interview Location / Link
                          <input
                            value={draft.interviewLocation}
                            onChange={(e) =>
                              updateDraft(
                                application._id,
                                'interviewLocation',
                                e.target.value
                              )
                            }
                            placeholder="Office address, Google Meet link, or WhatsApp call note"
                          />
                        </label>

                        <label>
                          Employer Note
                          <textarea
                            value={draft.employerNote}
                            onChange={(e) =>
                              updateDraft(
                                application._id,
                                'employerNote',
                                e.target.value
                              )
                            }
                            placeholder="Private note for this application"
                          ></textarea>
                        </label>

                        <button
                          type="button"
                          className="btn btn-primary application-save-btn"
                          onClick={() => saveApplicationUpdate(application)}
                          disabled={updatingId === application._id}
                        >
                          <Save size={17} />
                          {updatingId === application._id
                            ? 'Saving...'
                            : 'Save Update'}
                        </button>
                      </div>

                      <div className="application-status-actions">
                        <button
                          type="button"
                          onClick={() =>
                            quickUpdateStatus(application, 'reviewed')
                          }
                          disabled={
                            updatingId === application._id ||
                            application.status === 'reviewed'
                          }
                        >
                          Mark Reviewed
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            quickUpdateStatus(application, 'shortlisted')
                          }
                          disabled={
                            updatingId === application._id ||
                            application.status === 'shortlisted'
                          }
                        >
                          Shortlist
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            quickUpdateStatus(application, 'contacted')
                          }
                          disabled={
                            updatingId === application._id ||
                            application.status === 'contacted'
                          }
                        >
                          Contacted
                        </button>

                        <button
                          type="button"
                          className="danger-action"
                          onClick={() =>
                            quickUpdateStatus(application, 'rejected')
                          }
                          disabled={
                            updatingId === application._id ||
                            application.status === 'rejected'
                          }
                        >
                          Reject
                        </button>
                      </div>

                      <small className="application-date">
                        Submitted:{' '}
                        {application.createdAt
                          ? new Date(application.createdAt).toLocaleString()
                          : 'N/A'}
                      </small>

                      {(application.interviewDate ||
                        application.interviewMethod ||
                        application.interviewLocation ||
                        application.employerNote) && (
                        <div className="application-saved-note">
                          <MessageSquare size={15} />
                          <div>
                            <strong>Saved employer details</strong>
                            <p>
                              Interview:{' '}
                              {formatDate(application.interviewDate)} • Method:{' '}
                              {application.interviewMethod || 'Not set'}
                            </p>
                            {application.interviewLocation && (
                              <p>Location/Link: {application.interviewLocation}</p>
                            )}
                            {application.employerNote && (
                              <p>Note: {application.employerNote}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}