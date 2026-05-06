import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Briefcase,
  Building2,
  Search,
  ShieldCheck,
  Users,
  MapPin,
  Clock,
} from 'lucide-react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import ScrollToTop from './components/ScrollToTop';
 

import Login from './pages/Login';
import RegisterChoice from './pages/RegisterChoice';
import EmployerRegister from './pages/EmployerRegister';
import JobSeekerRegister from './pages/JobSeekerRegister';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployerPostJob from './pages/EmployerPostJob';
import EmployerEditJob from './pages/EmployerEditJob';
import EmployerApplications from './pages/EmployerApplications';

import About from './pages/About';
import HelpCenter from './pages/HelpCenter';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Commitment from './pages/Commitment';
import Safety from './pages/Safety';
import Contact from './pages/Contact';
import JobsPage from './pages/JobsPage';
import JobDetails from './pages/JobDetails';
import HowItWorks from './pages/HowItWorks';
import RouteTitle from './components/RouteTitle';

import JobSeekerResumes from './pages/JobSeekerResumes';
import JobSeekerAlerts from './pages/JobSeekerAlerts';
import JobSeekerSavedJobs from './pages/JobSeekerSavedJobs';
import JobSeekerApplications from './pages/JobSeekerApplications';
import Profile from './pages/Profile';
import HomePoll from './components/HomePoll';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

function Home() {
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
    fetchApprovedJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApprovedJobs = async (customFilters = filters) => {
    try {
      setLoadingJobs(true);

      const params = {};

      if (customFilters.search) params.search = customFilters.search;
      if (customFilters.category) params.category = customFilters.category;
      if (customFilters.location) params.location = customFilters.location;
      if (customFilters.jobType) params.jobType = customFilters.jobType;

      const res = await axios.get(`${API_URL}/jobs`, { params });

      setJobs(res.data || []);
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

  const submitSearch = (e) => {
    e.preventDefault();
    fetchApprovedJobs(filters);

    const jobsSection = document.getElementById('jobs');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetFilters = () => {
    const emptyFilters = {
      search: '',
      category: '',
      location: '',
      jobType: '',
    };

    setFilters(emptyFilters);
    fetchApprovedJobs(emptyFilters);
  };

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

  const shortenText = (value = '', max = 120) => {
    const text = cleanText(value);

    if (!text) return 'No description provided.';

    if (text.length > max) {
      return `${text.slice(0, max).trim()}...`;
    }

    return text;
  };

  const featuredJob = jobs[0];

  return (
    <div className="site">
      <Navbar />

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="badge">
                <ShieldCheck size={16} />
                Trusted job platform for Ghana
              </div>

              <h1>Find the right job or hire the right talent faster.</h1>

              <p className="hero-text">
                JoblyHub connects job seekers with real opportunities and helps
                employers reach qualified candidates with ease.
              </p>

              <form className="search-card" onSubmit={submitSearch}>
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
                    <option value="Technology & IT">Technology & IT</option>
                    <option value="Business, Administration & Customer Service">
                      Business, Administration & Customer Service
                    </option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Finance & Accounting">
                      Finance & Accounting
                    </option>
                    <option value="Engineering & Technical">
                      Engineering & Technical
                    </option>
                    <option value="Healthcare & Medical">
                      Healthcare & Medical
                    </option>
                    <option value="Education & Training">
                      Education & Training
                    </option>
                    <option value="Transport & Logistics">
                      Transport & Logistics
                    </option>
                    <option value="Skilled Trades">Skilled Trades</option>
                    <option value="Hospitality, Travel & Services">
                      Hospitality, Travel & Services
                    </option>
                    <option value="Creative & Design">Creative & Design</option>
                    <option value="NGO & Development">NGO & Development</option>
                  </select>
                </div>

                <button className="btn btn-search" type="submit">
                  Search Jobs
                </button>
              </form>

              <div className="hero-stats">
                <div>
                  <strong>{jobs.length}+</strong>
                  <span>Approved jobs</span>
                </div>

                 

                <div>
                  <strong>24/7</strong>
                  <span>Access</span>
                </div>
              </div>
            </div>

            <div className="hero-panel">
              <div className="panel-card main-card">
                <div className="job-icon">
                  <Briefcase size={24} />
                </div>

                <div>
                  <h3>
                    {cleanText(featuredJob?.title) || 'Frontend Developer'}
                  </h3>
                  <p>
                    {cleanText(featuredJob?.companyName) ||
                      'Trend Space Ventures'}
                  </p>
                  <span>
                    {cleanText(featuredJob?.location) || 'Accra, Ghana'} •{' '}
                    {cleanText(featuredJob?.jobType) || 'Full-time'}
                  </span>
                </div>
              </div>

              <div className="panel-card mini-card card-one">
                <Building2 size={22} />
                <div>
                  <strong>Employers</strong>
                  <span>Post jobs with review approval</span>
                </div>
              </div>

              <div className="panel-card mini-card card-two">
                <Users size={22} />
                <div>
                  <strong>Job Seekers</strong>
                  <span>Apply, save, and track jobs</span>
                </div>
              </div>
            </div>
            <HomePoll />
          </div>

        </section>

        <section className="jobs-section" id="jobs">
          <section className="trust-proof-section">
  <div className="container">
    <div className="section-heading">
      <span>Why trust JoblyHub?</span>
      <h2>Built to make job searching safer and clearer.</h2>
      <p>
        We are focused on helping job seekers find cleaner opportunities while
        giving employers a trusted place to share real openings.
      </p>
    </div>

    <div className="trust-proof-grid">
      <div className="trust-proof-card">
        <div className="trust-proof-icon">
          <ShieldCheck size={24} />
        </div>
        <h3>Verified listings</h3>
        <p>
          Job posts are checked before appearing publicly, helping reduce fake
          or misleading listings.
        </p>
      </div>

      <div className="trust-proof-card">
        <div className="trust-proof-icon">
          <Briefcase size={24} />
        </div>
        <h3>Manual review before jobs go live</h3>
        <p>
          Employers can submit opportunities, but listings must pass review
          before job seekers see them.
        </p>
      </div>

      <div className="trust-proof-card">
        <div className="trust-proof-icon">
          <Users size={24} />
        </div>
        <h3>No payment required from job seekers</h3>
        <p>
          Job seekers can browse opportunities, save jobs, and apply without
          paying JoblyHub.
        </p>
      </div>
    </div>
  </div>
</section>
          <div className="container">
            <div className="section-heading">
              <span>Latest Opportunities</span>
              <h2>Approved jobs currently available on JoblyHub.</h2>
            </div>

            <div className="filter-bar">
              <div className="search-field">
                <MapPin size={18} />
                <input
                  name="location"
                  value={filters.location}
                  onChange={updateFilter}
                  placeholder="Filter by location"
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
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <button className="btn btn-primary" onClick={submitSearch}>
                Apply Filters
              </button>

              <button className="btn btn-ghost" onClick={resetFilters}>
                Reset
              </button>
            </div>

            {loadingJobs && <p className="state-text">Loading jobs...</p>}

            {error && <p className="state-text error-text">{error}</p>}

            {!loadingJobs && !error && jobs.length === 0 && (
              <p className="state-text">No approved jobs available yet.</p>
            )}

            {!loadingJobs && !error && jobs.length > 0 && (
              <>
                <div className="jobs-grid">
                  {jobs.slice(0, 6).map((job) => {
                    const title = cleanText(job.title) || 'Untitled Job';
                    const companyName =
                      cleanText(job.companyName) || 'Company';
                    const location =
                      cleanText(job.location) || 'Not provided';
                    const jobType =
                      cleanText(job.jobType) || 'Not provided';
                    const category =
                      cleanText(job.category) || 'Uncategorized';

                    return (
                      <article className="job-card" key={job._id}>
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
                          {shortenText(job.description, 120)}
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

                <div className="view-all-wrap">
                  <Link to="/jobs" className="btn btn-primary">
                    View All Jobs
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="features" id="how-it-works">
          <div className="container">
            <div className="section-heading">
              <span>Why JoblyHub?</span>
              <h2>A simple and reliable way to connect opportunities.</h2>
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <Briefcase />
                <h3>Real job listings</h3>
                <p>
                  Jobs are reviewed before appearing publicly, helping users
                  discover cleaner and more reliable opportunities.
                </p>
              </div>

              <div className="feature-card">
                <Building2 />
                <h3>Employer dashboard</h3>
                <p>
                  Employers can post jobs, manage listings, and view
                  applications from one simple dashboard.
                </p>
              </div>

              <div className="feature-card">
                <Users />
                <h3>Job seeker tools</h3>
                <p>
                  Job seekers can save jobs, apply for roles, and track their
                  application history.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
       <RouteTitle />
      <ScrollToTop />

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/commitment" element={<Commitment />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* Public-only pages */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterChoice />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register/employer"
          element={
            <PublicOnlyRoute>
              <EmployerRegister />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register/job-seeker"
          element={
            <PublicOnlyRoute>
              <JobSeekerRegister />
            </PublicOnlyRoute>
          }
        />

        {/* Admin protected */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Employer protected */}
        <Route
          path="/employer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['employer', 'admin']}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/post-job"
          element={
            <ProtectedRoute allowedRoles={['employer', 'admin']}>
              <EmployerPostJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/edit-job/:id"
          element={
            <ProtectedRoute allowedRoles={['employer', 'admin']}>
              <EmployerEditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/applications"
          element={
            <ProtectedRoute allowedRoles={['employer', 'admin']}>
              <EmployerApplications />
            </ProtectedRoute>
          }
        />

        {/* Job seeker protected */}
        <Route
          path="/job-seeker/dashboard"
          element={
            <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
       {/* Job seeker protected */}
<Route
  path="/job-seeker/dashboard"
  element={
    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
      <JobSeekerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/job-seeker/resumes"
  element={
    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
      <JobSeekerResumes />
    </ProtectedRoute>
  }
/>

<Route
  path="/job-seeker/alerts"
  element={
    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
      <JobSeekerAlerts />
    </ProtectedRoute>
  }
/>

<Route
  path="/job-seeker/saved-jobs"
  element={
    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
      <JobSeekerSavedJobs />
    </ProtectedRoute>
  }
/>

<Route
  path="/job-seeker/applications"
  element={
    <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
      <JobSeekerApplications />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute allowedRoles={['job_seeker', 'employer', 'admin']}>
      <Profile />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}