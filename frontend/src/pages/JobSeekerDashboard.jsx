import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Bookmark,
  Briefcase,
  FileText,
  MapPin,
  RefreshCcw,
  UserRound,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-1.onrender.com/api';
export default function JobSeekerDashboard() {
  const user = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');
  const token = localStorage.getItem('joblyhubToken');

  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [savedRes, applicationsRes] = await Promise.all([
        axios.get(`${API_URL}/saved-jobs/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/applications/my-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setSavedJobs(savedRes.data);
      setApplications(applicationsRes.data);
      setMessage('');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to load your dashboard. Please login again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const removeSavedJob = async (jobId) => {
    if (!jobId) return;

    try {
      await axios.delete(`${API_URL}/saved-jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedJobs((prev) => prev.filter((item) => item.job?._id !== jobId));
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Failed to remove saved job. Please try again.'
      );
    }
  };

  const stats = useMemo(() => {
    return {
      saved: savedJobs.length,
      applied: applications.length,
      shortlisted: applications.filter((app) => app.status === 'shortlisted')
        .length,
    };
  }, [savedJobs, applications]);

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page seeker-dashboard-page">
        <div className="container">
          <div className="dashboard-top seeker-top">
            <div>
              <span>Job Seeker Dashboard</span>
              <h1>Welcome, {user.name || 'Job Seeker'}</h1>
              <p>
                Track saved jobs, monitor applications, and keep your profile
                information ready for opportunities.
              </p>
            </div>

            <div className="dashboard-actions">
              <button
                className="btn btn-ghost dash-action"
                onClick={fetchDashboardData}
              >
                <RefreshCcw size={18} />
                Refresh
              </button>

              <Link to="/jobs" className="btn btn-primary dash-action">
                <Briefcase size={18} />
                Browse Jobs
              </Link>
            </div>
          </div>

          <div className="stats-grid seeker-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <Bookmark size={22} />
              </div>
              <div>
                <strong>{stats.saved}</strong>
                <span>Saved Jobs</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon approved">
                <FileText size={22} />
              </div>
              <div>
                <strong>{stats.applied}</strong>
                <span>Applications</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                <Briefcase size={22} />
              </div>
              <div>
                <strong>{stats.shortlisted}</strong>
                <span>Shortlisted</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <UserRound size={22} />
              </div>
              <div>
                <strong>{user.experienceLevel || '-'}</strong>
                <span>Experience Level</span>
              </div>
            </div>
          </div>

          {message && <p className="form-message error-text">{message}</p>}

          {loading && <p className="state-text">Loading dashboard...</p>}

          {!loading && !message && (
            <div className="seeker-grid">
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <span>Saved Jobs</span>
                    <h2>Your saved opportunities</h2>
                  </div>
                </div>

                {savedJobs.length === 0 ? (
                  <div className="empty-state">
                    <h3>No saved jobs yet</h3>
                    <p>Save interesting jobs so you can return to them later.</p>
                    <Link to="/jobs" className="btn btn-primary">
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="mini-list">
                    {savedJobs.map((item) => (
                      <div className="mini-job-card" key={item._id}>
                        <div>
                          <h3>{item.job?.title || 'Job unavailable'}</h3>
                          <p>{item.job?.companyName || 'Unknown company'}</p>
                          <span>
                            <MapPin size={14} />
                            {item.job?.location || 'No location'}
                          </span>
                        </div>

                        <div className="mini-actions">
                          {item.job?._id && (
                            <Link
                              to={`/jobs/${item.job._id}`}
                              className="table-link"
                            >
                              View
                            </Link>
                          )}

                          <button
                            className="table-link danger-action"
                            onClick={() => removeSavedJob(item.job?._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <span>Applied Jobs</span>
                    <h2>Your applications</h2>
                  </div>
                </div>

                {applications.length === 0 ? (
                  <div className="empty-state">
                    <h3>No applications yet</h3>
                    <p>Apply for jobs and track your application status here.</p>
                    <Link to="/jobs" className="btn btn-primary">
                      Find Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="mini-list">
                    {applications.map((application) => (
                      <div className="mini-job-card" key={application._id}>
                        <div>
                          <h3>{application.job?.title || 'Job unavailable'}</h3>
                          <p>
                            {application.job?.companyName || 'Unknown company'}
                          </p>
                          <span>
                            <MapPin size={14} />
                            {application.job?.location || 'No location'}
                          </span>
                        </div>

                        <span className={`status-badge ${application.status}`}>
                          {application.status || 'submitted'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          <section className="dashboard-panel profile-panel">
            <div className="panel-heading">
              <div>
                <span>Profile</span>
                <h2>Your profile information</h2>
              </div>
            </div>

            <div className="profile-grid">
              <div>
                <span>Full Name</span>
                <strong>{user.name || 'Not provided'}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{user.email || 'Not provided'}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{user.phone || 'Not provided'}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{user.location || 'Not provided'}</strong>
              </div>

              <div>
                <span>Preferred Category</span>
                <strong>{user.preferredJobCategory || 'Not provided'}</strong>
              </div>

              <div>
                <span>Qualification</span>
                <strong>{user.highestQualification || 'Not provided'}</strong>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}