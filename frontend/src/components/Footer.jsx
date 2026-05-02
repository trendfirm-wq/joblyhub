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