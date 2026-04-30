import { Briefcase, Building2, HelpCircle, Mail, Search, ShieldCheck } from 'lucide-react';
import InfoPage from './InfoPage';
import { Link } from 'react-router-dom';

export default function HelpCenter() {
  return (
    <InfoPage
      eyebrow="Help Center"
      title="Everything you need to use JoblyHub confidently."
      subtitle="Find quick answers for job seekers, employers, applications, and account support."
      badge="Support & guidance"
    >
      <section className="help-grid">
        <div className="help-card">
          <Search />
          <h3>Finding Jobs</h3>
          <p>
            Use the homepage search and filters to browse approved jobs by
            keyword, category, location, and job type.
          </p>
        </div>

        <div className="help-card">
          <Briefcase />
          <h3>Applying for Jobs</h3>
          <p>
            Each job includes an application method. You may apply by email,
            external link, or directly on JoblyHub.
          </p>
        </div>

        <div className="help-card">
          <Building2 />
          <h3>Posting Jobs</h3>
          <p>
            Employers can register, submit jobs, and track job status from their
            employer dashboard.
          </p>
        </div>

        <div className="help-card">
          <ShieldCheck />
          <h3>Admin Review</h3>
          <p>
            Submitted jobs stay pending until reviewed. Approved jobs are shown
            publicly.
          </p>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>Common Questions</span>
          <h2>Frequently asked questions</h2>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <h3>Why is my job still pending?</h3>
            <p>
              All jobs are reviewed by admin before they appear publicly. This
              helps keep listings clean and safe.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I edit a job after posting?</h3>
            <p>
              Yes. Employers can edit their listings. Depending on the change,
              the job may need review again.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can job seekers save jobs?</h3>
            <p>
              Yes. Logged-in job seekers can save jobs and view them from their
              dashboard.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I report a suspicious job?</h3>
            <p>
              Use the Contact page to reach JoblyHub support. Suspicious jobs
              can be reviewed and removed.
            </p>
          </div>
        </div>
      </section>

      <section className="support-strip">
        <HelpCircle />
        <div>
          <h2>Still need help?</h2>
          <p>Contact the JoblyHub team for support or employer enquiries.</p>
        </div>
        <Link to="/contact" className="btn btn-primary">
          <Mail size={18} />
          Contact Support
        </Link>
      </section>
    </InfoPage>
  );
}