import { Briefcase, Building2, CheckCircle2, Users } from 'lucide-react';
import InfoPage from './InfoPage';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <InfoPage
      eyebrow="About JoblyHub"
      title="A smarter way to connect jobs, employers, and talent."
      subtitle="JoblyHub is built to make job searching and hiring in Ghana simpler, cleaner, and more reliable."
      badge="Built for Ghana’s job market"
    >
      <section className="premium-section">
        <div className="section-heading left">
          <span>Who We Are</span>
          <h2>JoblyHub is a modern job platform for real opportunities.</h2>
          <p>
            We created JoblyHub to reduce the stress of job searching and make
            recruitment easier for employers. The platform focuses on clean job
            listings, structured submissions, and admin review before jobs go
            live.
          </p>
        </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">
              <Briefcase />
            </div>
            <h3>For Job Seekers</h3>
            <p>
              Discover approved opportunities, read clear job details, save
              jobs, and apply through the right channel.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <Building2 />
            </div>
            <h3>For Employers</h3>
            <p>
              Submit job openings, manage listings, and reach candidates through
              a simple and professional dashboard.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <CheckCircle2 />
            </div>
            <h3>Reviewed Listings</h3>
            <p>
              Jobs are reviewed before appearing publicly, helping to keep the
              platform cleaner and more trusted.
            </p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card dark-card">
          <span>Our Mission</span>
          <h2>Make hiring and job searching faster, clearer, and safer.</h2>
          <p>
            JoblyHub is starting as a strong MVP. The goal is to launch quickly,
            serve users well, and improve with better tools over time.
          </p>
        </div>

        <div className="split-card light-card">
          <Users />
          <h3>What makes JoblyHub different?</h3>
          <ul>
            <li>Simple navigation</li>
            <li>Clean job cards</li>
            <li>Structured employer submissions</li>
            <li>Admin approval workflow</li>
            <li>Future-ready dashboards</li>
          </ul>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Ready to explore opportunities?</h2>
          <p>Browse approved jobs or create an employer account to post a job.</p>
        </div>

        <div className="cta-actions">
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
          <Link to="/register/employer" className="btn btn-ghost">
            Post a Job
          </Link>
        </div>
      </section>
    </InfoPage>
  );
}