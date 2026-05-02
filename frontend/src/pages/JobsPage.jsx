import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Briefcase,
  Clock,
  MapPin,
  Search,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-1.onrender.com/api';
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

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    jobType: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (customFilters = filters) => {
    try {
      setLoadingJobs(true);

      const params = {};

      if (customFilters.search) params.search = customFilters.search;
      if (customFilters.category) params.category = customFilters.category;
      if (customFilters.location) params.location = customFilters.location;
      if (customFilters.jobType) params.jobType = customFilters.jobType;

      const res = await axios.get(`${API_URL}/jobs`, { params });

      setJobs(res.data);
      setError('');
    } catch (err) {
      setError('Unable to load jobs. Please make sure the backend is running.');
    } finally {
      setLoadingJobs(false);
    }
  };

  const updateFilter = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitFilters = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      search: '',
      category: '',
      location: '',
      jobType: '',
    };

    setFilters(emptyFilters);
    fetchJobs(emptyFilters);
  };

  return (
    <div className="site">
      <Navbar />

      <main className="jobs-page">
        <section className="jobs-hero">
          <div className="container jobs-hero-inner">
            <div>
              <div className="info-badge">Approved Opportunities</div>
              <h1>Browse all jobs on JoblyHub.</h1>
              <p>
                Explore approved job opportunities from employers. Use filters
                to find jobs by keyword, category, location, or job type.
              </p>
            </div>

            <div className="jobs-hero-card">
              <Briefcase />
              <strong>{jobs.length}</strong>
              <span>Available approved jobs</span>
            </div>
          </div>
        </section>

        <section className="jobs-content">
          <div className="container">
            <form className="jobs-filter-panel" onSubmit={submitFilters}>
              <div className="filter-title">
                <SlidersHorizontal size={20} />
                <div>
                  <h2>Find your next opportunity</h2>
                  <p>Search and filter approved job listings.</p>
                </div>
              </div>

              <div className="jobs-filter-grid">
                <div className="search-field">
                  <Search size={18} />
                  <input
                    name="search"
                    value={filters.search}
                    onChange={updateFilter}
                    placeholder="Job title, keyword, or company"
                  />
                </div>

                <div className="search-field">
                  <Briefcase size={18} />
                  <select
                    name="category"
                    value={filters.category}
                    onChange={updateFilter}
                  >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                      <option value={category} key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="search-field">
                  <MapPin size={18} />
                  <input
                    name="location"
                    value={filters.location}
                    onChange={updateFilter}
                    placeholder="Location"
                  />
                </div>

                <div className="search-field">
                  <Clock size={18} />
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={updateFilter}
                  >
                    <option value="">All job types</option>
                    {jobTypes.map((type) => (
                      <option value={type} key={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="jobs-filter-actions">
                <button className="btn btn-primary" type="submit">
                  Search Jobs
                </button>

                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </form>

            <div className="jobs-results-top">
              <div>
                <span>Job Results</span>
                <h2>
                  {loadingJobs
                    ? 'Loading jobs...'
                    : `${jobs.length} approved job${jobs.length === 1 ? '' : 's'} found`}
                </h2>
              </div>
            </div>

            {loadingJobs && <p className="state-text">Loading jobs...</p>}

            {error && <p className="state-text error-text">{error}</p>}

            {!loadingJobs && !error && jobs.length === 0 && (
              <div className="empty-state jobs-empty">
                <XCircle size={42} />
                <h3>No approved jobs found</h3>
                <p>
                  Try changing your search filters or check again later for new
                  opportunities.
                </p>
              </div>
            )}

            {!loadingJobs && !error && jobs.length > 0 && (
              <div className="jobs-list-grid">
                {jobs.map((job) => (
                  <article className="job-card premium-job-card" key={job._id}>
                    <div className="job-card-top">
                      <div className="job-logo">
                        {job.companyName?.charAt(0) || 'J'}
                      </div>

                      <div>
                        <h3>{job.title}</h3>
                        <p>{job.companyName}</p>
                      </div>
                    </div>

                    <div className="job-meta">
                      <span>
                        <MapPin size={15} />
                        {job.location}
                      </span>

                      <span>
                        <Clock size={15} />
                        {job.jobType}
                      </span>
                    </div>

                    <p className="job-desc">
                      {job.description?.length > 150
                        ? `${job.description.slice(0, 150)}...`
                        : job.description}
                    </p>

                    <div className="job-card-bottom">
                      <span className="job-pill">{job.category}</span>

                      <Link to={`/jobs/${job._id}`} className="btn btn-small">
                        View Details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}