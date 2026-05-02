import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  RefreshCcw,
  XCircle,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-1.onrender.com/api';
export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');
  const token = localStorage.getItem('joblyhubToken');

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

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

      fetchJobs();
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

      fetchJobs();
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
        <div className="dashboard-top">
          <div>
            <span>Admin Dashboard</span>
            <h1>Welcome, {user.name || 'Admin'}</h1>
            <p>
              Review submitted jobs, approve or reject listings, and manage
              public job visibility.
            </p>
          </div>

          <button className="btn btn-ghost dash-action" onClick={fetchJobs}>
            <RefreshCcw size={18} />
            Refresh
          </button>
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
    <Footer />
    </div>
  );
}