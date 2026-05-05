import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Briefcase,
  Building2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
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

const experienceLevels = ['Entry Level', 'Junior', 'Mid-Level', 'Senior'];

export default function Profile() {
  const token = localStorage.getItem('joblyhubToken');
  const savedUser = JSON.parse(localStorage.getItem('joblyhubUser') || '{}');

  const [user, setUser] = useState(savedUser);
  const [form, setForm] = useState({
    name: savedUser.name || '',
    email: savedUser.email || '',
    phone: savedUser.phone || '',

    location: savedUser.location || '',
    preferredJobCategory: savedUser.preferredJobCategory || '',
    highestQualification: savedUser.highestQualification || '',
    experienceLevel: savedUser.experienceLevel || '',

    companyName: savedUser.companyName || '',
    companyIndustry: savedUser.companyIndustry || '',
    companyWebsite: savedUser.companyWebsite || '',
    companyDescription: savedUser.companyDescription || '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const freshUser = res.data;
      setUser(freshUser);
      localStorage.setItem('joblyhubUser', JSON.stringify(freshUser));

      setForm({
        name: freshUser.name || '',
        email: freshUser.email || '',
        phone: freshUser.phone || '',

        location: freshUser.location || '',
        preferredJobCategory: freshUser.preferredJobCategory || '',
        highestQualification: freshUser.highestQualification || '',
        experienceLevel: freshUser.experienceLevel || '',

        companyName: freshUser.companyName || '',
        companyIndustry: freshUser.companyIndustry || '',
        companyWebsite: freshUser.companyWebsite || '',
        companyDescription: freshUser.companyDescription || '',
      });

      setMessage('');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Unable to load your profile.'
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

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!form.name.trim()) {
      setMessage('Name is required.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name,
        phone: form.phone,

        location: form.location,
        preferredJobCategory: form.preferredJobCategory,
        highestQualification: form.highestQualification,
        experienceLevel: form.experienceLevel,

        companyName: form.companyName,
        companyIndustry: form.companyIndustry,
        companyWebsite: form.companyWebsite,
        companyDescription: form.companyDescription,
      };

      const res = await axios.put(`${API_URL}/auth/update-profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = res.data.user;
      setUser(updatedUser);
      localStorage.setItem('joblyhubUser', JSON.stringify(updatedUser));

      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  const dashboardPath =
    user.role === 'employer'
      ? '/employer/dashboard'
      : user.role === 'admin'
      ? '/admin/dashboard'
      : '/job-seeker/dashboard';

  return (
    <div className="site">
      <Navbar />

      <main className="profile-page">
        <div className="container">
          <section className="profile-hero">
            <div>
              <span>Account Profile</span>
              <h1>Manage your profile</h1>
              <p>
                Keep your account information updated so JoblyHub can show the
                right details across your dashboard and applications.
              </p>
            </div>

            <Link to={dashboardPath} className="btn btn-ghost">
              Back to Dashboard
            </Link>
          </section>

          {message && <p className="form-message">{message}</p>}

          {loading ? (
            <p className="state-text">Loading profile...</p>
          ) : (
            <div className="profile-layout">
              <aside className="profile-summary-card">
                <div className="profile-avatar-large">
                  {user.name?.charAt(0) || 'U'}
                </div>

                <h2>{user.name || 'User'}</h2>
                <p>{user.email}</p>

                <div className="profile-summary-list">
                  <div>
                    <UserRound size={16} />
                    <span>{user.role || 'job_seeker'}</span>
                  </div>

                  <div>
                    <Phone size={16} />
                    <span>{user.phone || 'Phone not provided'}</span>
                  </div>

                  <div>
                    <MapPin size={16} />
                    <span>{user.location || 'Location not provided'}</span>
                  </div>

                  <div>
                    <Briefcase size={16} />
                    <span>{user.experienceLevel || 'Experience not set'}</span>
                  </div>
                </div>
              </aside>

              <section className="profile-form-card">
                <form className="auth-form" onSubmit={saveProfile}>
                  <div className="form-section-title">Basic Information</div>

                  <label>
                    Full Name
                    <input
                      name="name"
                      value={form.name}
                      onChange={updateForm}
                      placeholder="Your full name"
                      required
                    />
                  </label>

                  <label>
                    Email Address
                    <div className="input-with-icon">
                      <Mail size={17} />
                      <input value={form.email} disabled />
                    </div>
                    <small className="form-help-text">
                      Email cannot be changed here.
                    </small>
                  </label>

                  <label>
                    Phone Number
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={updateForm}
                      placeholder="Phone number"
                    />
                  </label>

                  {(user.role === 'job_seeker' || user.role === 'admin') && (
                    <>
                      <div className="form-section-title">
                        Job Seeker Information
                      </div>

                      <label>
                        Location
                        <input
                          name="location"
                          value={form.location}
                          onChange={updateForm}
                          placeholder="e.g. Accra, Ghana"
                        />
                      </label>

                      <label>
                        Preferred Job Category
                        <select
                          name="preferredJobCategory"
                          value={form.preferredJobCategory}
                          onChange={updateForm}
                        >
                          <option value="">Select category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Highest Qualification
                        <input
                          name="highestQualification"
                          value={form.highestQualification}
                          onChange={updateForm}
                          placeholder="e.g. Degree, HND, SHS, Diploma"
                        />
                      </label>

                      <label>
                        Experience Level
                        <select
                          name="experienceLevel"
                          value={form.experienceLevel}
                          onChange={updateForm}
                        >
                          <option value="">Select experience level</option>
                          {experienceLevels.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}

                  {(user.role === 'employer' || user.role === 'admin') && (
                    <>
                      <div className="form-section-title">
                        Employer Information
                      </div>

                      <label>
                        Company Name
                        <div className="input-with-icon">
                          <Building2 size={17} />
                          <input
                            name="companyName"
                            value={form.companyName}
                            onChange={updateForm}
                            placeholder="Company name"
                          />
                        </div>
                      </label>

                      <label>
                        Company Industry
                        <select
                          name="companyIndustry"
                          value={form.companyIndustry}
                          onChange={updateForm}
                        >
                          <option value="">Select industry</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Company Website
                        <input
                          name="companyWebsite"
                          value={form.companyWebsite}
                          onChange={updateForm}
                          placeholder="https://example.com"
                        />
                      </label>

                      <label>
                        Company Description
                        <textarea
                          name="companyDescription"
                          value={form.companyDescription}
                          onChange={updateForm}
                          placeholder="Short company description"
                        ></textarea>
                      </label>
                    </>
                  )}

                  <button className="btn btn-primary auth-btn" disabled={saving}>
                    <Save size={18} />
                    {saving ? 'Saving Profile...' : 'Save Profile'}
                  </button>
                </form>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}