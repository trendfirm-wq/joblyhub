import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Briefcase,
  CalendarDays,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  RefreshCcw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

export default function JobSeekerApplications() {
  const token = localStorage.getItem('joblyhubToken');

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/applications/my-applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data || []);
      setMessage('');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Unable to load applications.'
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: applications.length,
      submitted: applications.filter(
        (app) => (app.status || 'submitted') === 'submitted'
      ).length,
      reviewed: applications.filter((app) => app.status === 'reviewed').length,
      shortlisted: applications.filter((app) => app.status === 'shortlisted')
        .length,
    };
  }, [applications]);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Date not available';

    return new Date(dateValue).toLocaleDateString();
  };

  const getStatusText = (status) => {
    return status || 'submitted';
  };

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-top">
            <div>
              <span>Job Seeker</span>
              <h1>My Applications</h1>
              <p>
                Track all jobs you have applied for through JoblyHub and monitor
                their progress.
              </p>
            </div>

            <div className="dashboard-actions">
              <button
                type="button"
                className="btn btn-ghost dash-action"
                onClick={fetchApplications}
              >
                <RefreshCcw size={17} />
                Refresh
              </button>

              <Link to="/job-seeker/dashboard" className="btn btn-ghost">
                Back to Dashboard
              </Link>
            </div>
          </div>

          {message && <p className="form-message error-text">{message}</p>}

          <section className="application-summary-grid">
            <div className="application-summary-card">
              <div className="application-summary-icon">
                <FileText size={20} />
              </div>
              <div>
                <strong>{stats.total}</strong>
                <span>Total Applications</span>
              </div>
            </div>

            <div className="application-summary-card">
              <div className="application-summary-icon">
                <Clock size={20} />
              </div>
              <div>
                <strong>{stats.submitted}</strong>
                <span>Submitted</span>
              </div>
            </div>

            <div className="application-summary-card">
              <div className="application-summary-icon">
                <CheckCircle size={20} />
              </div>
              <div>
                <strong>{stats.reviewed}</strong>
                <span>Reviewed</span>
              </div>
            </div>

            <div className="application-summary-card">
              <div className="application-summary-icon">
                <Briefcase size={20} />
              </div>
              <div>
                <strong>{stats.shortlisted}</strong>
                <span>Shortlisted</span>
              </div>
            </div>
          </section>

          <section className="seeker-panel">
            <div className="seeker-panel-head">
              <div>
                <span>Application History</span>
                <h2>
                  {loading
                    ? 'Loading applications...'
                    : `${applications.length} application${
                        applications.length === 1 ? '' : 's'
                      }`}
                </h2>
              </div>

              <Link to="/jobs" className="table-link">
                Browse jobs
              </Link>
            </div>

            {loading ? (
              <p className="state-text">Loading applications...</p>
            ) : applications.length === 0 ? (
              <div className="seeker-empty-box">
                <CheckCircle size={34} />
                <h3>No applications yet</h3>
                <p>
                  Apply through JoblyHub and your applications will appear here.
                </p>
                <Link to="/jobs" className="btn btn-primary">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="application-list">
                {applications.map((application) => {
                  const job = application.job;

                  return (
                    <article className="application-card" key={application._id}>
                      <div className="application-card-main">
                        <div className="application-logo">
                          {job?.companyName?.charAt(0) || 'J'}
                        </div>

                        <div>
                          <h3>{job?.title || 'Job unavailable'}</h3>
                          <p>{job?.companyName || 'Unknown company'}</p>

                          <div className="application-meta">
                            <span>
                              <CalendarDays size={14} />
                              Applied {formatDate(application.createdAt)}
                            </span>

                            <span>
                              <MapPin size={14} />
                              {job?.location || 'No location'}
                            </span>

                            <span>
                              <Briefcase size={14} />
                              {job?.jobType || 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="application-actions">
                        <span
                          className={`application-status ${getStatusText(
                            application.status
                          )}`}
                        >
                          {getStatusText(application.status)}
                        </span>

                        {job?._id && (
                          <Link
                            to={`/jobs/${job._id}`}
                            className="table-link application-view-link"
                          >
                            <ExternalLink size={14} />
                            View Job
                          </Link>
                        )}
                      </div>
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