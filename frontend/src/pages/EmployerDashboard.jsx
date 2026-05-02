import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  PlusCircle,
  RefreshCcw,
  XCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-1.onrender.com/api';
export default function EmployerDashboard() {
  const user = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');
  const token = localStorage.getItem('joblyhubToken');

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoadingJobs(true);

      const res = await axios.get(`${API_URL}/jobs/my-jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data);
      setMessage('');
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          'Unable to load your jobs. Please login again.'
      );
    } finally {
      setLoadingJobs(false);
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

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-top employer-top">
            <div>
              <span>Employer Dashboard</span>
              <h1>Welcome, {user.name || 'Employer'}</h1>
              <p>
                Post job opportunities, track approval status, and manage all
                your listings from one clean dashboard.
              </p>
            </div>

            <div className="dashboard-actions">
              <button className="btn btn-ghost dash-action" onClick={fetchMyJobs}>
                <RefreshCcw size={18} />
                Refresh
              </button>

              <Link to="/employer/post-job" className="btn btn-primary dash-action">
                <PlusCircle size={18} />
                Post Job
              </Link>
            </div>
          </div>

          <div className="stats-grid">
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
          </div>

          <section className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <span>My Listings</span>
                <h2>Posted jobs</h2>
              </div>

              <Link to="/employer/post-job" className="table-link">
                New Job
              </Link>
            </div>

            {message && <p className="form-message error-text">{message}</p>}

            {loadingJobs && <p className="state-text">Loading your jobs...</p>}

            {!loadingJobs && !message && jobs.length === 0 && (
              <div className="empty-state">
                <h3>No jobs posted yet</h3>
                <p>
                  Start by posting your first job opportunity for admin review.
                </p>

                <Link to="/employer/post-job" className="btn btn-primary empty-btn">
                  Post Your First Job
                </Link>
              </div>
            )}

            {!loadingJobs && !message && jobs.length > 0 && (
              <div className="table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Job</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Deadline</th>
                      <th>Date Posted</th>
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

                        <td>{job.category}</td>

                        <td>{job.jobType}</td>

                        <td>
                          <span className={`status-badge ${job.status}`}>
                            {job.status}
                          </span>

                          {job.status === 'rejected' && job.rejectionReason && (
                            <small className="rejection-note">
                              {job.rejectionReason}
                            </small>
                          )}
                        </td>

                        <td>
                          {job.deadline
                            ? new Date(job.deadline).toLocaleDateString()
                            : 'No deadline'}
                        </td>

                        <td>
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        <td>
                          <div className="table-actions">
                            <Link
                              to={`/employer/edit-job/${job._id}`}
                              className="table-link"
                            >
                              Edit
                            </Link>

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
    </div>
  );
}