import { Link } from 'react-router-dom';
import logo from '../assets/Icon PNG background-011.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="JoblyHub Logo" />
          </Link>

          <p>
            JoblyHub connects job seekers with real opportunities and helps
            employers find the right talent faster.
          </p>

          <div className="footer-socials">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="footer-social-icon"
            >
              in
            </a>

            <a
              href="https://www.facebook.com/share/1annNUs4rZ/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="footer-social-icon"
            >
              f
            </a>

            <a
              href="https://x.com/JoblyHub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="footer-social-icon"
            >
              X
            </a>

            <a
              href="https://whatsapp.com/channel/0029Vb7xkVm4tRrnkxs1UK2A"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="footer-social-icon"
            >
              ☎
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Platform</h4>
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/about">About JoblyHub</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>Support</h4>
          <Link to="/help">Help Center</Link>
          <Link to="/safety">Safety & Fraud Alert</Link>
          <Link to="/commitment">Our Commitment</Link>
          <Link to="/how-it-works">How It Works</Link>
        </div>

        <div className="footer-col">
          <h4>Working Hours</h4>

          <div className="footer-hours-list">
            <div className="footer-hours-item">
              <span>Monday – Friday</span>
              <strong>8:00 AM – 6:00 PM</strong>
            </div>

            <div className="footer-hours-item">
              <span>Saturday</span>
              <strong>9:00 AM – 2:00 PM</strong>
            </div>

            <div className="footer-hours-item">
              <span>Sunday & Public Holidays</span>
              <strong>Closed</strong>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} JoblyHub. All rights reserved.</p>
      </div>
    </footer>
  );
}