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
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

const categories = [
  'Agriculture & Farming',
  'Business & Administration',
  'Construction & Real Estate',
  'Creative & Design',
  'Customer Service & Support',
  'Education & Training',
  'Engineering & Technical',
  'Finance & Accounting',
  'Healthcare & Medical',
  'Hospitality & Tourism',
  'Human Resources & Recruitment',
  'Legal & Compliance',
  'Media & Communications',
  'Mining, Energy & Extractives',
  'Project Management',
  'Sales & Marketing',
  'Security Services',
  'Skilled Trades & Artisans',
  'Technology & IT',
  'Transport & Logistics',
  'General & Other Jobs',
];


const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    jobType: '',
  });

  const cleanText = (value = '') => {
    if (!value) return '';

    const textarea = document.createElement('textarea');
    textarea.innerHTML = String(value);
    const decodedText = textarea.value;

    const temp = document.createElement('div');
    temp.innerHTML = decodedText;

    return (temp.textContent || temp.innerText || '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const shortenText = (value = '', max = 150) => {
    const text = cleanText(value);

    if (!text) return 'No description provided.';

    if (text.length > max) {
      return `${text.slice(0, max).trim()}...`;
    }

    return text;
  };

  const buildCleanParams = (customFilters) => {
    const params = {};

    if (customFilters.search?.trim()) {
      params.search = customFilters.search.trim();
    }

    if (customFilters.category) {
      params.category = customFilters.category;
    }

    if (customFilters.location?.trim()) {
      params.location = customFilters.location.trim();
    }

    if (customFilters.jobType) {
      params.jobType = customFilters.jobType;
    }

    return params;
  };

  const fetchJobs = async (customFilters = filters) => {
    try {
      setLoadingJobs(true);

      const params = buildCleanParams(customFilters);

      const res = await axios.get(`${API_URL}/jobs`, { params });

      setJobs(res.data || []);
      setError('');
    } catch (err) {
      setError('Unable to load jobs. Please make sure the backend is running.');
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      location: searchParams.get('location') || '',
      jobType: searchParams.get('jobType') || '',
    };

    setFilters(urlFilters);
    fetchJobs(urlFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateFilter = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitFilters = (e) => {
    e.preventDefault();

    const cleanParams = buildCleanParams(filters);
    setSearchParams(cleanParams);
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
    setSearchParams({});
    fetchJobs(emptyFilters);
  };

  const hasActiveFilters =
    filters.search || filters.category || filters.location || filters.jobType;

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

            {hasActiveFilters && (
              <div className="active-filter-note">
                <Search size={16} />
                <p>
                  Showing jobs matching your selected filters. You can adjust
                  the filters above or reset them to view all approved jobs.
                </p>
              </div>
            )}

            <div className="jobs-results-top">
              <div>
                 
              </div>
            </div>

            <div className="jobs-update-note">
              <Briefcase size={18} />
              <p>
                We are actively adding new job opportunities. Check back
                regularly for updates.
              </p>
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
                {jobs.map((job) => {
                  const title = cleanText(job.title) || 'Untitled Job';
                  const companyName = cleanText(job.companyName) || 'Company';
                  const location = cleanText(job.location) || 'Not provided';
                  const jobType = cleanText(job.jobType) || 'Not provided';
                  const category = cleanText(job.category) || 'Uncategorized';

                  return (
                    <article
                      className="job-card premium-job-card"
                      key={job._id}
                    >
                      <div className="job-card-top">
                        <div className="job-logo">
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={`${companyName} logo`}
                              className="job-card-company-logo"
                            />
                          ) : (
                            companyName.charAt(0)
                          )}
                        </div>

                        <div>
                          <h3>{title}</h3>
                          <p>{companyName}</p>
                        </div>
                      </div>

                      <div className="job-meta">
                        <span>
                          <MapPin size={15} />
                          {location}
                        </span>

                        <span>
                          <Clock size={15} />
                          {jobType}
                        </span>
                      </div>

                      <p className="job-desc">
                        {shortenText(job.description, 150)}
                      </p>

                      <div className="job-card-bottom">
                        <span className="job-pill">{category}</span>

                        <Link
                          to={`/jobs/${job._id}`}
                          className="btn btn-small"
                        >
                          View Details
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}