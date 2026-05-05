import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Bookmark,
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  RefreshCcw,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

export default function JobSeekerSavedJobs() {
  const token = localStorage.getItem('joblyhubToken');

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSavedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/saved-jobs/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedJobs(res.data || []);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  const removeSavedJob = async (jobId) => {
    if (!jobId) return;

    const confirmRemove = window.confirm(
      'Remove this job from your saved jobs?'
    );

    if (!confirmRemove) return;

    try {
      setRemovingId(jobId);

      await axios.delete(`${API_URL}/saved-jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedJobs((prev) => prev.filter((item) => item.job?._id !== jobId));
      setMessage('Saved job removed successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to remove saved job.'
      );
    } finally {
      setRemovingId('');
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'Date not available';

    return new Date(dateValue).toLocaleDateString();
  };

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-top">
            <div>
              <span>Job Seeker</span>
              <h1>My Saved Jobs</h1>
              <p>
                Keep track of opportunities you want to revisit and apply for
                later.
              </p>
            </div>

            <div className="dashboard-actions">
              <button
                type="button"
                className="btn btn-ghost dash-action"
                onClick={fetchSavedJobs}
              >
                <RefreshCcw size={17} />
                Refresh
              </button>

              <Link to="/job-seeker/dashboard" className="btn btn-ghost">
                Back to Dashboard
              </Link>
            </div>
          </div>

          {message && <p className="form-message">{message}</p>}

          <section className="seeker-panel">
            <div className="seeker-panel-head">
              <div>
                <span>Saved Opportunities</span>
                <h2>
                  {loading
                    ? 'Loading saved jobs...'
                    : `${savedJobs.length} saved job${
                        savedJobs.length === 1 ? '' : 's'
                      }`}
                </h2>
              </div>

              <Link to="/jobs" className="table-link">
                Browse more jobs
              </Link>
            </div>

            {loading ? (
              <p className="state-text">Loading saved jobs...</p>
            ) : savedJobs.length === 0 ? (
              <div className="seeker-empty-box">
                <Bookmark size={34} />
                <h3>No saved jobs yet</h3>
                <p>
                  Save jobs from the job details page and they will appear here.
                </p>
                <Link to="/jobs" className="btn btn-primary">
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="seeker-job-list">
                {savedJobs.map((item) => {
                  const job = item.job;

                  return (
                    <article className="seeker-mini-job" key={item._id}>
                      <div>
                        <h3>{job?.title || 'Job unavailable'}</h3>
                        <p>{job?.companyName || 'Unknown company'}</p>

                        <div className="saved-job-meta">
                          <span>
                            <MapPin size={14} />
                            {job?.location || 'No location'}
                          </span>

                          <span>
                            <Briefcase size={14} />
                            {job?.jobType || 'Not specified'}
                          </span>

                          <span>
                            <CalendarDays size={14} />
                            Saved {formatDate(item.createdAt)}
                          </span>
                        </div>

                        {job?.deadline && (
                          <div className="saved-job-deadline">
                            <Clock size={14} />
                            Deadline: {formatDate(job.deadline)}
                          </div>
                        )}
                      </div>

                      <div className="seeker-mini-actions">
                        {job?._id && (
                          <Link to={`/jobs/${job._id}`} className="table-link">
                            View Details
                          </Link>
                        )}

                        <button
                          type="button"
                          className="table-link danger-action"
                          onClick={() => removeSavedJob(job?._id)}
                          disabled={removingId === job?._id}
                        >
                          <Trash2 size={14} />
                          {removingId === job?._id ? 'Removing...' : 'Remove'}
                        </button>
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