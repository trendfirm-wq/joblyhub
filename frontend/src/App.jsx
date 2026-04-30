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
  ArrowLeft,
  Mail,
  Link as LinkIcon,
  Bookmark,
  Send,
} from 'lucide-react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from 'react-router-dom';
import logo from './assets/Icon PNG background-01.png';
import './App.css';
import Login from './pages/Login';
import RegisterChoice from './pages/RegisterChoice';
import EmployerRegister from './pages/EmployerRegister';
import JobSeekerRegister from './pages/JobSeekerRegister';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmployerPostJob from './pages/EmployerPostJob';
import EmployerEditJob from './pages/EmployerEditJob';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import About from './pages/About';
import HelpCenter from './pages/HelpCenter';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Commitment from './pages/Commitment';
import Safety from './pages/Safety';
import Contact from './pages/Contact';
import JobsPage from './pages/JobsPage';


const API_URL = 'http://localhost:5000/api';


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
      <option value="Finance & Accounting">Finance & Accounting</option>
      <option value="Engineering & Technical">Engineering & Technical</option>
      <option value="Healthcare & Medical">Healthcare & Medical</option>
      <option value="Education & Training">Education & Training</option>
      <option value="Transport & Logistics">Transport & Logistics</option>
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
                  <strong>50+</strong>
                  <span>Employers</span>
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
                  <h3>{jobs[0]?.title || 'Frontend Developer'}</h3>
                  <p>{jobs[0]?.companyName || 'Trend Space Ventures'}</p>
                  <span>
                    {jobs[0]?.location || 'Accra, Ghana'} •{' '}
                    {jobs[0]?.jobType || 'Full-time'}
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
          </div>
        </section>

        <section className="jobs-section" id="jobs">
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
      {jobs.slice(0, 6).map((job) => (
        <article className="job-card" key={job._id}>
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
            {job.description?.length > 120
              ? `${job.description.slice(0, 120)}...`
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

function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
const [savingJob, setSavingJob] = useState(false);
const [applying, setApplying] = useState(false);

const user = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');
const token = localStorage.getItem('joblyhubToken');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoadingJob(true);
      const res = await axios.get(`${API_URL}/jobs/${id}`);
      setJob(res.data);
      setError('');
    } catch (err) {
      setError('Unable to load this job. It may not be approved or available.');
    } finally {
      setLoadingJob(false);
    }
  };
const saveJob = async () => {
  setActionMessage('');

  if (!token) {
    setActionMessage('Please login as a job seeker to save this job.');
    return;
  }

  try {
    setSavingJob(true);

    await axios.post(
      `${API_URL}/saved-jobs/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setActionMessage('Job saved successfully.');
  } catch (error) {
    setActionMessage(
      error.response?.data?.message || 'Unable to save this job.'
    );
  } finally {
    setSavingJob(false);
  }
};

const applyOnPlatform = async () => {
  setActionMessage('');

  if (!token) {
    setActionMessage('Please login as a job seeker to apply for this job.');
    return;
  }

  if (user.role !== 'job_seeker') {
    setActionMessage('Only job seeker accounts can apply for jobs.');
    return;
  }

  try {
    setApplying(true);

    await axios.post(
      `${API_URL}/applications/${id}/apply`,
      {
        fullName: user.name,
        email: user.email,
        phone: user.phone || '',
        coverLetter: 'Application submitted through JoblyHub.',
        resumeLink: user.resumeUrl || '',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setActionMessage('Application submitted successfully.');
  } catch (error) {
    setActionMessage(
      error.response?.data?.message || 'Unable to submit application.'
    );
  } finally {
    setApplying(false);
  }
};
  if (loadingJob) {
    return (
      <div className="site">
        <Navbar />
        <div className="container page-state">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="site">
        <Navbar />
        <div className="container page-state error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="site">
      <Navbar />

      <main className="details-page">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={18} />
            Back to jobs
          </Link>

          <div className="details-grid">
            <section className="details-main">
              <div className="details-header">
                <div className="job-logo details-logo">
                  {job.companyName?.charAt(0) || 'J'}
                </div>

                <div>
                  <span className="job-pill">{job.category}</span>
                  <h1>{job.title}</h1>
                  <p>{job.companyName}</p>
                </div>
              </div>

              <div className="details-meta">
                <span>
                  <MapPin size={16} />
                  {job.location}
                </span>
                <span>
                  <Clock size={16} />
                  {job.jobType}
                </span>
                {job.salary && <span>{job.salary}</span>}
              </div>

              <div className="details-section">
                <h2>Job Description</h2>
                <p>{job.description}</p>
              </div>
              {job.companyDescription && (
  <div className="details-section">
    <h2>About the Company</h2>
    <p>{job.companyDescription}</p>
  </div>
)}
              {job.requirements && (
                <div className="details-section">
                  <h2>Requirements</h2>
                  <p>{job.requirements}</p>
                </div>
              )}

              {job.responsibilities && (
                <div className="details-section">
                  <h2>Responsibilities</h2>
                  <p>{job.responsibilities}</p>
                </div>
              )}
            </section>
{job.applicationInstructions && (
  <div className="details-section">
    <h2>Application Instructions</h2>
    <p>{job.applicationInstructions}</p>
  </div>
)}
            <aside className="apply-card">
              <h3>Apply for this job</h3>
              <p>
                Review the job details carefully before sending your
                application.
              </p>

              {job.applicationMethod === 'email' && job.applicationEmail && (
                <a
                  href={`mailto:${job.applicationEmail}?subject=Application for ${job.title}`}
                  className="btn btn-primary apply-btn"
                >
                  <Mail size={18} />
                  Apply by Email
                </a>
              )}

              {job.applicationMethod === 'link' && job.applicationLink && (
                <a
                  href={job.applicationLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary apply-btn"
                >
                  <LinkIcon size={18} />
                  Apply on Website
                </a>
              )}

            {job.applicationMethod === 'platform' && (
  <button
    className="btn btn-primary apply-btn"
    onClick={applyOnPlatform}
    disabled={applying}
  >
    <Send size={18} />
    {applying ? 'Applying...' : 'Apply on JoblyHub'}
  </button>
)}
 <button
  className="btn btn-ghost save-job-btn"
  onClick={saveJob}
  disabled={savingJob}
>
  <Bookmark size={18} />
  {savingJob ? 'Saving...' : 'Save Job'}
</button>

{actionMessage && <p className="action-message">{actionMessage}</p>}           

              <div className="apply-info">
                <span>Industry</span>
                <strong>{job.industry || 'Not specified'}</strong>
              </div>
               {job.companyWebsite && (
  <div className="apply-info">
    <span>Company Website</span>
    <a href={job.companyWebsite} target="_blank" rel="noreferrer">
      Visit website
    </a>
  </div>
)}
              <div className="apply-info">
                <span>Deadline</span>
                <strong>
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : 'Not specified'}
                </strong>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

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

        {/* Job seeker protected */}
        <Route
          path="/job-seeker/dashboard"
          element={
            <ProtectedRoute allowedRoles={['job_seeker', 'admin']}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
<Route path="/help" element={<HelpCenter />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/commitment" element={<Commitment />} />
<Route path="/safety" element={<Safety />} />
<Route path="/contact" element={<Contact />} />
<Route path="/jobs" element={<JobsPage />} />
      </Routes>
    </BrowserRouter>
  );
}