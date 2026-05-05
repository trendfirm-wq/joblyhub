import { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, FileText, Star, Trash2, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://joblyhub-tc8k.onrender.com/api';

export default function JobSeekerResumes() {
  const token = localStorage.getItem('joblyhubToken');

  const [resumes, setResumes] = useState([]);
  const [title, setTitle] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchResumes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/resumes/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResumes(res.data || []);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load resumes.');
    } finally {
      setLoading(false);
    }
  };

  const getGoogleDocsViewerUrl = (fileUrl) => {
    if (!fileUrl) return '#';

    return `https://docs.google.com/viewer?url=${encodeURIComponent(
      fileUrl
    )}&embedded=false`;
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!resumeFile) {
      setMessage('Please select a PDF resume.');
      return;
    }

    if (resumeFile.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed.');
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      setMessage('Resume must be less than 5MB.');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('title', title || resumeFile.name);
      formData.append('resume', resumeFile);

      await axios.post(`${API_URL}/resumes`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle('');
      setResumeFile(null);

      const fileInput = document.querySelector('#resume-upload-input');
      if (fileInput) fileInput.value = '';

      await fetchResumes();
      setMessage('Resume uploaded successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const makeDefault = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/resumes/${id}/default`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchResumes();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to set default resume.'
      );
    }
  };

  const deleteResume = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this resume?'
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchResumes();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete resume.');
    }
  };

  return (
    <div className="site">
      <Navbar />

      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-top">
            <div>
              <span>Job Seeker</span>
              <h1>My Resumes</h1>
              <p>
                Upload and manage the CVs you use for job applications. Your
                resume will open in Google Docs Viewer when you click View.
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
                  <span>Upload Resume</span>
                  <h2>Add a new CV</h2>
                </div>
              </div>

              <form className="auth-form" onSubmit={uploadResume}>
                <label>
                  Resume Title
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Software Developer CV"
                  />
                </label>

                <label>
                  PDF Resume
                  <div className="joblyhub-pdf-upload">
                    <input
                      id="resume-upload-input"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setResumeFile(e.target.files?.[0])}
                    />

                    <div>
                      <UploadCloud size={30} />
                      <strong>
                        {resumeFile ? resumeFile.name : 'Upload PDF resume'}
                      </strong>
                      <small>Maximum size: 5MB. PDF only.</small>
                    </div>
                  </div>
                </label>

                <button className="btn btn-primary auth-btn" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </button>
              </form>
            </section>

            <section className="seeker-panel">
              <div className="seeker-panel-head">
                <div>
                  <span>Saved Resumes</span>
                  <h2>Your uploaded resumes</h2>
                </div>
              </div>

              {loading ? (
                <p className="state-text">Loading resumes...</p>
              ) : resumes.length === 0 ? (
                <div className="seeker-empty-box">
                  <FileText size={34} />
                  <h3>No resumes uploaded</h3>
                  <p>Upload your CV so you can apply faster.</p>
                </div>
              ) : (
                <div className="seeker-job-list">
                  {resumes.map((resume) => (
                    <div className="seeker-mini-job" key={resume._id}>
                      <div>
                        <h3>{resume.title}</h3>
                        <p>{resume.originalName || 'PDF Resume'}</p>
                        <span>
                          <FileText size={14} />
                          {resume.isDefault ? 'Default resume' : 'Uploaded CV'}
                        </span>
                      </div>

                      <div className="seeker-mini-actions">
                        <a
                          href={getGoogleDocsViewerUrl(resume.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="table-link"
                        >
                          <ExternalLink size={14} />
                          View
                        </a>

                        {!resume.isDefault && (
                          <button
                            type="button"
                            className="table-link"
                            onClick={() => makeDefault(resume._id)}
                          >
                            <Star size={14} />
                            Default
                          </button>
                        )}

                        <button
                          type="button"
                          className="table-link danger-action"
                          onClick={() => deleteResume(resume._id)}
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