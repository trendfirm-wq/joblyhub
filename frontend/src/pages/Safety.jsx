import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, XCircle } from 'lucide-react';
import InfoPage from './InfoPage';
import { Link } from 'react-router-dom';

export default function Safety() {
  return (
    <InfoPage
      eyebrow="Safety & Fraud Alert"
      title="Stay safe when searching and applying for jobs."
      subtitle="JoblyHub reviews job listings, but users should still be careful before sharing information or accepting offers."
      badge="User safety first"
    >
      <section className="warning-panel">
        <div className="warning-icon">
          <ShieldAlert />
        </div>

        <div>
          <h2>Important safety notice</h2>
          <p>
            Do not send money to anyone claiming they can guarantee a job,
            interview, appointment letter, visa, or recruitment placement.
          </p>
        </div>
      </section>

      <section className="safety-grid">
        <div className="safety-card danger">
          <AlertTriangle />
          <h3>Be careful if someone asks for money</h3>
          <p>
            A genuine employer should not require payment before offering an
            interview or job.
          </p>
        </div>

        <div className="safety-card danger">
          <XCircle />
          <h3>Avoid unrealistic promises</h3>
          <p>
            Be cautious of job offers that promise very high pay with little or
            no clear responsibility.
          </p>
        </div>

        <div className="safety-card safe">
          <ShieldCheck />
          <h3>Check the employer details</h3>
          <p>
            Review company name, website, contact details, and application
            instructions before applying.
          </p>
        </div>

        <div className="safety-card safe">
          <CheckCircle2 />
          <h3>Use official application channels</h3>
          <p>
            Apply through the email, website, or platform method shown on the
            job details page.
          </p>
        </div>
      </section>

      <section className="checklist-section">
        <div className="section-heading left">
          <span>Safety Checklist</span>
          <h2>Before you apply, check these points.</h2>
        </div>

        <div className="checklist">
          <div>Confirm the company name looks genuine.</div>
          <div>Read the job description carefully.</div>
          <div>Do not pay money to get shortlisted.</div>
          <div>Avoid sharing sensitive personal information too early.</div>
          <div>Report suspicious job posts to JoblyHub.</div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Seen something suspicious?</h2>
          <p>Contact JoblyHub so the listing can be reviewed.</p>
        </div>

        <Link to="/contact" className="btn btn-primary">
          Report Concern
        </Link>
      </section>
    </InfoPage>
  );
}