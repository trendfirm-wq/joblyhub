import { Building2, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RegisterChoice() {
  return (
    <main className="auth-page">
      <div className="choice-wrap">
        <div className="auth-heading center">
          <span>Create account</span>
          <h1>How do you want to use JoblyHub?</h1>
          <p>Choose the account type that matches your purpose.</p>
        </div>

        <div className="choice-grid">
          <Link to="/register/employer" className="choice-card">
            <Building2 size={34} />
            <h2>I am an Employer</h2>
            <p>Post jobs, manage listings, and review applications.</p>
          </Link>

          <Link to="/register/job-seeker" className="choice-card">
            <UserRound size={34} />
            <h2>I am a Job Seeker</h2>
            <p>Find jobs, save opportunities, and apply to openings.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}