import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  Eye,
  RefreshCcw,
  UserCheck,
  Users,
  Building2,
  X,
  XCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');
  const token = localStorage.getItem('joblyhubToken');

  const [jobs, setJobs] = useState([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    jobSeekers: 0,
    employers: 0,
    admins: 0,
  });

  const [loadingJobs, setLoadingJobs] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    await Promise.all([fetchJobs(), fetchUserStats()]);
  };

  const fetchUserStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/admin/user-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserStats({
        totalUsers: res.data.totalUsers || 0,
        jobSeekers: res.data.jobSeekers || 0,
        employers: res.data.employers || 0,
        admins: res.data.admins || 0,
      });
    } catch (error) {
      console.log('Failed to fetch user stats:', error.response?.data || error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);

      const res = await axios.get(`${API_URL}/jobs/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data);
      setMessage('');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to load admin jobs. Please login again.'
      );
    } finally {
      setLoadingJobs(false);
    }
  };

  const approveJob = async (jobId) => {
    try {
      await axios.put(
        `${API_URL}/jobs/admin/${jobId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedJob(null);
      fetchDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to approve job.');
    }
  };

  const rejectJob = async (jobId) => {
    const reason = window.prompt('Enter rejection reason:');

    if (reason === null) return;

    try {
      await axios.put(
        `${API_URL}/jobs/admin/${jobId}/reject`,
        {
          rejectionReason: reason || 'No reason provided',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedJob(null);
      fetchDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reject job.');
    }
  };

  const deleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this job? This cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedJob(null);
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete job.');
    }
  };

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      pending: jobs.filter((job) => job.status === 'pending').length,
      approved: jobs.filter((job) => job.status === 'approved').length,
      rejected: jobs.filter((job) => job.status === 'rejected').length,
    };
  }, [jobs]);

  const renderHtml = (html) => {
    return { __html: html || '<p>Not provided</p>' };
  };

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-top admin-top">
            <div>
              <span>Admin Dashboard</span>
              <h1>
                Welcome, {user.role === 'admin' ? 'JoblyHub' : user.name || 'Admin'}
              </h1>
              <p>
                Review submitted jobs, approve or reject listings, and manage
                public job visibility.
              </p>
            </div>

            <button
              className="btn btn-ghost dash-action refresh-btn"
              onClick={fetchDashboardData}
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
                <strong>{userStats.totalUsers}</strong>
                <span>Total Users</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon approved">
                <UserCheck size={22} />
              </div>
              <div>
                <strong>{userStats.jobSeekers}</strong>
                <span>Job Seekers</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                <Building2 size={22} />
              </div>
              <div>
                <strong>{userStats.employers}</strong>
                <span>Employers</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Briefcase size={22} />
              </div>
              <div>
                <strong>{stats.total}</strong>
                <span>Total Jobs</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon pending">
                <Clock3 size={22} />
              </div>
              <div>
                <strong>{stats.pending}</strong>
                <span>Pending Review</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon approved">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <strong>{stats.approved}</strong>
                <span>Approved</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon rejected">
                <XCircle size={22} />
              </div>
              <div>
                <strong>{stats.rejected}</strong>
                <span>Rejected</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Users size={22} />
              </div>
              <div>
                <strong>{userStats.admins}</strong>
                <span>Admins</span>
              </div>
            </div>
          </div>

          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>Job Review</span>
                <h2>Submitted jobs</h2>
              </div>
            </div>

            {message && <p className="form-message error-text">{message}</p>}

            {loadingJobs && <p className="state-text">Loading jobs...</p>}

            {!loadingJobs && !message && jobs.length === 0 && (
              <div className="empty-state">
                <h3>No jobs found</h3>
                <p>Submitted jobs will appear here for review.</p>
              </div>
            )}

            {!loadingJobs && !message && jobs.length > 0 && (
              <div className="table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Job</th>
                      <th>Employer</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        <td>
                          <strong>{job.title}</strong>
                          <small>{job.location}</small>
                        </td>

                        <td>
                          <strong>{job.companyName}</strong>
                          <small>{job.employer?.email || 'No email'}</small>
                        </td>

                        <td>{job.category}</td>
                        <td>{job.jobType}</td>

                        <td>
                          <span className={`status-badge ${job.status}`}>
                            {job.status}
                          </span>
                        </td>

                        <td>{new Date(job.createdAt).toLocaleDateString()}</td>

                        <td>
                          <div className="table-actions">
                            <button
                              className="table-link review-action"
                              onClick={() => setSelectedJob(job)}
                            >
                              <Eye size={14} />
                              Review
                            </button>

                            <Link
                              to={`/employer/edit-job/${job._id}`}
                              className="table-link muted-action"
                            >
                              Edit
                            </Link>

                            <button
                              className="table-link"
                              onClick={() => approveJob(job._id)}
                              disabled={job.status === 'approved'}
                            >
                              Approve
                            </button>

                            <button
                              className="table-link muted-action"
                              onClick={() => rejectJob(job._id)}
                              disabled={job.status === 'rejected'}
                            >
                              Reject
                            </button>

                            <button
                              className="table-link danger-action"
                              onClick={() => deleteJob(job._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {selectedJob && (
        <div className="admin-review-backdrop">
          <div className="admin-review-modal">
            <button
              type="button"
              className="admin-review-close"
              onClick={() => setSelectedJob(null)}
            >
              <X size={20} />
            </button>

            <div className="admin-review-header">
              <span>Job Review</span>
              <h2>{selectedJob.title}</h2>
              <p>
                Review the full job information before approving or rejecting
                this listing.
              </p>
            </div>

            <div className="admin-review-status-row">
              <span className={`status-badge ${selectedJob.status}`}>
                {selectedJob.status}
              </span>
              <small>
                Submitted on{' '}
                {new Date(selectedJob.createdAt).toLocaleDateString()}
              </small>
            </div>

            <div className="admin-review-grid">
              <div>
                <span>Company</span>
                <strong>{selectedJob.companyName || 'Not provided'}</strong>
              </div>

              <div>
                <span>Employer Email</span>
                <strong>{selectedJob.employer?.email || 'Not provided'}</strong>
              </div>

              <div>
                <span>Category</span>
                <strong>{selectedJob.category || 'Not provided'}</strong>
              </div>

              <div>
                <span>Type</span>
                <strong>{selectedJob.jobType || 'Not provided'}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{selectedJob.location || 'Not provided'}</strong>
              </div>

              <div>
                <span>Salary / Budget</span>
                <strong>{selectedJob.salary || 'Not provided'}</strong>
              </div>

              <div>
                <span>Industry</span>
                <strong>{selectedJob.industry || 'Not provided'}</strong>
              </div>

              <div>
                <span>Deadline</span>
                <strong>
                  {selectedJob.deadline
                    ? new Date(selectedJob.deadline).toLocaleDateString()
                    : 'Not provided'}
                </strong>
              </div>
            </div>

            <div className="admin-review-section">
              <h3>Business Description</h3>
              <div
                className="admin-review-html"
                dangerouslySetInnerHTML={renderHtml(
                  selectedJob.companyDescription
                )}
              />
            </div>

            <div className="admin-review-section">
              <h3>Job Description</h3>
              <div
                className="admin-review-html"
                dangerouslySetInnerHTML={renderHtml(selectedJob.description)}
              />
            </div>

            <div className="admin-review-section">
              <h3>Responsibilities / What is needed</h3>
              <div
                className="admin-review-html"
                dangerouslySetInnerHTML={renderHtml(
                  selectedJob.responsibilities
                )}
              />
            </div>

            <div className="admin-review-section">
              <h3>Requirements</h3>
              <div
                className="admin-review-html"
                dangerouslySetInnerHTML={renderHtml(selectedJob.requirements)}
              />
            </div>

            <div className="admin-review-section">
              <h3>How users should respond</h3>

              <div className="admin-review-grid compact">
                <div>
                  <span>Method</span>
                  <strong>{selectedJob.applicationMethod}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedJob.applicationEmail || 'Not provided'}</strong>
                </div>

                <div>
                  <span>Link</span>
                  <strong>{selectedJob.applicationLink || 'Not provided'}</strong>
                </div>
              </div>

              <div
                className="admin-review-html"
                dangerouslySetInnerHTML={renderHtml(
                  selectedJob.applicationInstructions
                )}
              />
            </div>

            <div className="admin-review-section">
              <h3>Contact Details</h3>

              <div className="admin-review-grid compact">
                <div>
                  <span>Name</span>
                  <strong>{selectedJob.contactName || 'Not provided'}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedJob.contactEmail || 'Not provided'}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{selectedJob.contactPhone || 'Not provided'}</strong>
                </div>
              </div>
            </div>

            {selectedJob.rejectionReason && (
              <div className="admin-review-section danger">
                <h3>Rejection Reason</h3>
                <p>{selectedJob.rejectionReason}</p>
              </div>
            )}

            <div className="admin-review-actions">
              <Link
                to={`/employer/edit-job/${selectedJob._id}`}
                className="admin-review-secondary"
              >
                Edit Job
              </Link>

              <button
                type="button"
                className="admin-review-danger"
                onClick={() => rejectJob(selectedJob._id)}
                disabled={selectedJob.status === 'rejected'}
              >
                Reject
              </button>

              <button
                type="button"
                className="admin-review-primary"
                onClick={() => approveJob(selectedJob._id)}
                disabled={selectedJob.status === 'approved'}
              >
                Approve Job
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}