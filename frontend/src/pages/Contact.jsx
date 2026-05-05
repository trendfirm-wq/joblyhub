import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Briefcase,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import InfoPage from './InfoPage';

export default function Contact() {
  return (
    <InfoPage
      eyebrow="Contact JoblyHub"
      title="Talk to us about support, jobs, partnerships, or enquiries."
      subtitle="Reach the JoblyHub team for help with employer accounts, job listings, applications, suspicious jobs, or platform questions."
      badge="We are here to help"
    >
      <section className="contact-layout">
        {/* LEFT SIDE */}
        <div className="contact-main">
          <div className="section-heading left">
            <span>Contact Us</span>
            <h2>Contact Details</h2>
            <p>
              Use the options below to reach JoblyHub support. For faster
              assistance, include relevant details like job title, company name,
              or issue description.
            </p>
          </div>

          <div className="contact-cards">
            <a
              href="mailto:info@joblyhub.com?subject=JoblyHub%20Support%20Enquiry"
              className="contact-card"
            >
              <Mail />
              <div>
                <span>Email</span>
                <strong>info@joblyhub.com</strong>
              </div>
            </a>

            <a href="tel:+233204116245" className="contact-card">
              <Phone />
              <div>
                <span>Phone</span>
                <strong>0204 116 245</strong>
              </div>
            </a>

            <a
              href="https://wa.me/233204116245?text=Hello%20JoblyHub%2C%20I%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card"
            >
              <MessageCircle />
              <div>
                <span>WhatsApp</span>
                <strong>0204 116 245</strong>
              </div>
            </a>

            <div className="contact-card">
              <MapPin />
              <div>
                <span>Location</span>
                <strong>Ghana</strong>
              </div>
            </div>
          </div>

          <div className="contact-info-box">
            <div className="contact-info-title">
              <Clock size={20} />
              <h3>Support Hours</h3>
            </div>

            <ul className="contact-info-list">
              <li>
                <span>Monday – Friday</span>
                <strong>8:00 AM – 6:00 PM</strong>
              </li>
              <li>
                <span>Saturday</span>
                <strong>9:00 AM – 2:00 PM</strong>
              </li>
              <li>
                <span>Sunday & Public Holidays</span>
                <strong>Closed</strong>
              </li>
            </ul>
          </div>

          <div className="contact-info-box">
            <div className="contact-info-title">
              <CheckCircle2 size={20} />
              <h3>What We Can Help With</h3>
            </div>

            <ul className="contact-help-list">
              <li>Job application issues</li>
              <li>Employer account setup</li>
              <li>Job listing approvals</li>
              <li>Suspicious or fake job reports</li>
              <li>General platform support</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="contact-form-card">
          <div className="form-card-icon">
            <Send />
          </div>

          <h3>How would you like to reach us?</h3>

          <p>
            Choose the option that works best for you. We typically respond
            within 24 hours.
          </p>

          <div className="contact-direct-actions">
            <a
              href="mailto:info@joblyhub.com?subject=JoblyHub%20Support%20Enquiry"
              className="btn btn-primary"
            >
              <Mail size={18} />
              Send Email
            </a>

            <a href="tel:+233204116245" className="btn btn-ghost">
              <Phone size={18} />
              Call Now
            </a>

            <a
              href="https://wa.me/233204116245?text=Hello%20JoblyHub%2C%20I%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </div>

          <div className="contact-note">
            <strong>Before You Contact Us</strong>
            <p>To help us resolve your issue faster, please include:</p>

            <ul>
              <li>Your full name</li>
              <li>Job title, if applicable</li>
              <li>Company name, if applicable</li>
              <li>A short description of your issue</li>
            </ul>
          </div>

          <div className="quick-help-box">
            <h4>Quick Help</h4>
            <p>Before reaching out, you might find answers here:</p>

            <div className="quick-help-links">
              <Link to="/help-center">
                <HelpCircle size={17} />
                Help Center
              </Link>

              <Link to="/safety">
                <ShieldAlert size={17} />
                Safety & Fraud Alerts
              </Link>

              <Link to="/how-it-works">
                <Briefcase size={17} />
                How JoblyHub Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </InfoPage>
  );
}