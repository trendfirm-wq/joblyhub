import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Bell,
  Briefcase,
  MapPin,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

const categories = [
  'Technology & IT',
  'Business, Administration & Customer Service',
  'Sales & Marketing',
  'Finance & Accounting',
  'Engineering & Technical',
  'Healthcare & Medical',
  'Education & Training',
  'Transport & Logistics',
  'Skilled Trades',
  'Hospitality, Travel & Services',
  'Creative & Design',
  'NGO & Development',
];

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

export default function JobSeekerAlerts() {
  const token = localStorage.getItem('joblyhubToken');

  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({
    keyword: '',
    category: '',
    location: '',
    jobType: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/job-alerts/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlerts(res.data || []);
      setMessage('');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Unable to load job alerts.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createAlert = async (e) => {
    e.preventDefault();
    setMessage('');

    const hasAnyPreference =
      form.keyword.trim() ||
      form.category ||
      form.location.trim() ||
      form.jobType;

    if (!hasAnyPreference) {
      setMessage('Please provide at least one alert preference.');
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        `${API_URL}/job-alerts`,
        {
          keyword: form.keyword.trim(),
          category: form.category,
          location: form.location.trim(),
          jobType: form.jobType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setForm({
        keyword: '',
        category: '',
        location: '',
        jobType: '',
      });

      await fetchAlerts();
      setMessage('Job alert created successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to create job alert.'
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleAlert = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/job-alerts/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchAlerts();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to update job alert.'
      );
    }
  };

  const deleteAlert = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this job alert?'
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/job-alerts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchAlerts();
      setMessage('Job alert deleted successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to delete job alert.'
      );
    }
  };

  const buildAlertTitle = (alert) => {
    if (alert.keyword) return alert.keyword;
    if (alert.category) return alert.category;
    if (alert.location) return alert.location;
    if (alert.jobType) return alert.jobType;

    return 'Job Alert';
  };

  const buildAlertMeta = (alert) => {
    const parts = [alert.category, alert.location, alert.jobType].filter(
      Boolean
    );

    return parts.length > 0 ? parts.join(' • ') : 'Any matching job';
  };

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-top">
            <div>
              <span>Job Seeker</span>
              <h1>My Job Alerts</h1>
              <p>
                Create alerts based on keyword, category, location, or job type.
                These preferences will help you track matching opportunities.
              </p>
            </div>

            <Link to="/job-seeker/dashboard" className="btn btn-ghost">
              Back to Dashboard
            </Link>
          </div>

          {message && <p className="form-message">{message}</p>}

          <div className="seeker-dashboard-grid">
            <section className="seeker-panel">
              <div className="seeker-panel-head">
                <div>
                  <span>Create Alert</span>
                  <h2>New job alert</h2>
                </div>
              </div>

              <form className="auth-form" onSubmit={createAlert}>
                <label>
                  Keyword
                  <div className="input-with-icon">
                    <Search size={17} />
                    <input
                      name="keyword"
                      value={form.keyword}
                      onChange={updateForm}
                      placeholder="e.g. Developer, Accountant"
                    />
                  </div>
                </label>

                <div className="form-grid two">
                  <label>
                    Category
                    <select
                      name="category"
                      value={form.category}
                      onChange={updateForm}
                    >
                      <option value="">Any category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
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
                    >
                      <option value="">Any job type</option>
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  Location
                  <div className="input-with-icon">
                    <MapPin size={17} />
                    <input
                      name="location"
                      value={form.location}
                      onChange={updateForm}
                      placeholder="e.g. Accra, Kumasi, Remote"
                    />
                  </div>
                </label>

                <button className="btn btn-primary auth-btn" disabled={saving}>
                  {saving ? 'Creating alert...' : 'Create Alert'}
                </button>
              </form>
            </section>

            <section className="seeker-panel">
              <div className="seeker-panel-head">
                <div>
                  <span>Alerts</span>
                  <h2>Your saved alerts</h2>
                </div>
              </div>

              {loading ? (
                <p className="state-text">Loading alerts...</p>
              ) : alerts.length === 0 ? (
                <div className="seeker-empty-box">
                  <Bell size={34} />
                  <h3>No job alerts yet</h3>
                  <p>
                    Create an alert so you can quickly track matching jobs.
                  </p>
                </div>
              ) : (
                <div className="seeker-job-list">
                  {alerts.map((alert) => (
                    <div className="seeker-mini-job" key={alert._id}>
                      <div>
                        <h3>{buildAlertTitle(alert)}</h3>
                        <p>{buildAlertMeta(alert)}</p>
                        <span>
                          <Bell size={14} />
                          {alert.isActive ? 'Active alert' : 'Paused alert'}
                        </span>
                      </div>

                      <div className="seeker-mini-actions">
                        <button
                          type="button"
                          className="table-link"
                          onClick={() => toggleAlert(alert._id)}
                        >
                          {alert.isActive ? (
                            <>
                              <ToggleRight size={15} />
                              Pause
                            </>
                          ) : (
                            <>
                              <ToggleLeft size={15} />
                              Activate
                            </>
                          )}
                        </button>

                        <Link
                          to={`/jobs?search=${encodeURIComponent(
                            alert.keyword || ''
                          )}&category=${encodeURIComponent(
                            alert.category || ''
                          )}&location=${encodeURIComponent(
                            alert.location || ''
                          )}&jobType=${encodeURIComponent(alert.jobType || '')}`}
                          className="table-link"
                        >
                          <Briefcase size={15} />
                          Find Jobs
                        </Link>

                        <button
                          type="button"
                          className="table-link danger-action"
                          onClick={() => deleteAlert(alert._id)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}