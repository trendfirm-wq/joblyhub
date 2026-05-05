import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Bell,
  Bookmark,
  Briefcase,
  CalendarDays,
  CheckCircle,
  FileText,
  LogOut,
  MapPin,
  RefreshCcw,
  Settings,
  UserRound,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

export default function JobSeekerDashboard() {
  const user = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');
  const token = localStorage.getItem('joblyhubToken');

  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      setSavedJobs(savedRes.data || []);
      setApplications(applicationsRes.data || []);
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

  const logout = () => {
    localStorage.removeItem('joblyhubToken');
    localStorage.removeItem('joblyhubUser');
    window.location.href = '/login';
  };

  const stats = useMemo(() => {
    return {
      saved: savedJobs.length,
      applications: applications.length,
      shortlisted: applications.filter((app) => app.status === 'shortlisted')
        .length,
      experience: user.experienceLevel || 'Not Set',
    };
  }, [savedJobs, applications, user.experienceLevel]);

  return (
    <div className="site">
      <Navbar />

      <main className="seeker-premium-page">
        <div className="container">
          <section className="seeker-hero-card">
            <div className="seeker-hero-content">
              <span>Job Seeker Dashboard</span>
              <h1>Welcome, {user.name || 'Job Seeker'}</h1>
              <p>
                Manage your job search, saved opportunities, applications,
                profile details, resumes, and job alerts from one place.
              </p>
            </div>

            <div className="seeker-hero-actions">
              <button
                type="button"
                className="seeker-refresh-btn"
                onClick={fetchDashboardData}
              >
                <RefreshCcw size={17} />
                Refresh
              </button>

              <Link to="/jobs" className="seeker-browse-btn">
                <Briefcase size={18} />
                Browse Jobs
              </Link>
            </div>
          </section>

          <section className="seeker-quick-access">
            <Link
              to="/job-seeker/dashboard"
              className="seeker-quick-card active"
            >
              <div className="seeker-quick-icon">
                <Briefcase size={20} />
              </div>
              <div>
                <strong>Dashboard</strong>
                <span>Overview</span>
              </div>
            </Link>

            <Link to="/job-seeker/resumes" className="seeker-quick-card">
              <div className="seeker-quick-icon">
                <FileText size={20} />
              </div>
              <div>
                <strong>My Resumes</strong>
                <span>Manage CVs</span>
              </div>
            </Link>

            <Link to="/job-seeker/alerts" className="seeker-quick-card">
              <div className="seeker-quick-icon">
                <Bell size={20} />
              </div>
              <div>
                <strong>Job Alerts</strong>
                <span>Notifications</span>
              </div>
            </Link>

            <Link to="/job-seeker/saved-jobs" className="seeker-quick-card">
              <div className="seeker-quick-icon">
                <Bookmark size={20} />
              </div>
              <div>
                <strong>Saved Jobs</strong>
                <span>{stats.saved} saved</span>
              </div>
            </Link>

            <Link to="/job-seeker/applications" className="seeker-quick-card">
              <div className="seeker-quick-icon">
                <CheckCircle size={20} />
              </div>
              <div>
                <strong>Applications</strong>
                <span>{stats.applications} sent</span>
              </div>
            </Link>

            <Link to="/profile" className="seeker-quick-card">
              <div className="seeker-quick-icon">
                <Settings size={20} />
              </div>
              <div>
                <strong>Edit Profile</strong>
                <span>Settings</span>
              </div>
            </Link>

            <button
              type="button"
              className="seeker-quick-card logout"
              onClick={logout}
            >
              <div className="seeker-quick-icon">
                <LogOut size={20} />
              </div>
              <div>
                <strong>Logout</strong>
                <span>End session</span>
              </div>
            </button>
          </section>

          <section className="seeker-stat-grid">
            <div className="seeker-stat-card">
              <div className="seeker-stat-icon teal">
                <Bookmark size={22} />
              </div>
              <div>
                <strong>{stats.saved}</strong>
                <span>Saved Jobs</span>
              </div>
            </div>

            <div className="seeker-stat-card">
              <div className="seeker-stat-icon green">
                <FileText size={22} />
              </div>
              <div>
                <strong>{stats.applications}</strong>
                <span>Applications</span>
              </div>
            </div>

            <div className="seeker-stat-card">
              <div className="seeker-stat-icon orange">
                <Briefcase size={22} />
              </div>
              <div>
                <strong>{stats.shortlisted}</strong>
                <span>Shortlisted</span>
              </div>
            </div>

            <div className="seeker-stat-card">
              <div className="seeker-stat-icon teal">
                <UserRound size={22} />
              </div>
              <div>
                <strong>{stats.experience}</strong>
                <span>Experience Level</span>
              </div>
            </div>
          </section>

          {message && <p className="form-message error-text">{message}</p>}

          {loading && <p className="state-text">Loading dashboard...</p>}

          {!loading && !message && (
            <section className="seeker-dashboard-grid">
              <div className="seeker-dashboard-main">
                <div className="seeker-panel">
                  <div className="seeker-panel-head">
                    <div>
                      <span>Saved Jobs</span>
                      <h2>Your saved opportunities</h2>
                    </div>

                    <Link to="/job-seeker/saved-jobs" className="table-link">
                      View all
                    </Link>
                  </div>

                  {savedJobs.length === 0 ? (
                    <div className="seeker-empty-box">
                      <Bookmark size={34} />
                      <h3>No saved jobs yet</h3>
                      <p>
                        Save interesting jobs so you can return to them later.
                      </p>
                      <Link to="/jobs" className="btn btn-primary">
                        Browse Jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="seeker-job-list">
                      {savedJobs.slice(0, 5).map((item) => (
                        <div className="seeker-mini-job" key={item._id}>
                          <div>
                            <h3>{item.job?.title || 'Job unavailable'}</h3>
                            <p>{item.job?.companyName || 'Unknown company'}</p>
                            <span>
                              <MapPin size={14} />
                              {item.job?.location || 'No location'}
                            </span>
                          </div>

                          <div className="seeker-mini-actions">
                            {item.job?._id && (
                              <Link
                                to={`/jobs/${item.job._id}`}
                                className="table-link"
                              >
                                View
                              </Link>
                            )}

                            <button
                              type="button"
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
                </div>

                <div className="seeker-panel">
                  <div className="seeker-panel-head">
                    <div>
                      <span>Applications</span>
                      <h2>Your recent applications</h2>
                    </div>

                    <Link to="/job-seeker/applications" className="table-link">
                      View all
                    </Link>
                  </div>

                  {applications.length === 0 ? (
                    <div className="seeker-empty-box">
                      <CheckCircle size={34} />
                      <h3>No applications yet</h3>
                      <p>
                        Apply for jobs through JoblyHub and track your
                        application status here.
                      </p>
                      <Link to="/jobs" className="btn btn-primary">
                        Find Jobs
                      </Link>
                    </div>
                  ) : (
                    <div className="seeker-job-list">
                      {applications.slice(0, 5).map((application) => (
                        <div className="seeker-mini-job" key={application._id}>
                          <div>
                            <h3>
                              {application.job?.title || 'Job unavailable'}
                            </h3>
                            <p>
                              {application.job?.companyName ||
                                'Unknown company'}
                            </p>
                            <span>
                              <CalendarDays size={14} />
                              {application.createdAt
                                ? new Date(
                                    application.createdAt
                                  ).toLocaleDateString()
                                : 'Submitted'}
                            </span>
                          </div>

                          <span
                            className={`status-badge ${
                              application.status || 'submitted'
                            }`}
                          >
                            {application.status || 'submitted'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <aside className="seeker-profile-card">
                <div className="seeker-profile-avatar">
                  {user.name?.charAt(0) || 'J'}
                </div>

                <h2>{user.name || 'Job Seeker'}</h2>
                <p>{user.email || 'Email not provided'}</p>

                <div className="seeker-profile-list">
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
                    <strong>
                      {user.preferredJobCategory || 'Not provided'}
                    </strong>
                  </div>

                  <div>
                    <span>Qualification</span>
                    <strong>
                      {user.highestQualification || 'Not provided'}
                    </strong>
                  </div>
                </div>

                <Link to="/profile" className="btn btn-primary full-btn">
                  Edit Profile
                </Link>
              </aside>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}