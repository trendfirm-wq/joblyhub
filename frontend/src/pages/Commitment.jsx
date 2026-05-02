import {
  CheckCircle2,
  HeartHandshake,
  Scale,
  ShieldCheck,
  Users,
  Eye,
  Building2,
  Globe2,
  RefreshCw,
  Handshake,
} from "lucide-react";
import InfoPage from "./InfoPage";

export default function Commitment() {
  return (
    <InfoPage
      eyebrow="Our Commitment"
      title="Building a fair, reliable, and trusted job platform."
      subtitle="At JoblyHub, access to employment is more than just a service — it is a responsibility."
      badge="Opportunity, fairness & progress"
    >
      <section className="premium-section">
        <div className="section-heading">
          <span>Our Promise</span>
          <h2>We are committed to supporting fair and transparent opportunities.</h2>
          <p>
            JoblyHub is built to support job seekers, employers, and communities
            through a platform that values access, trust, inclusion, and
            responsible recruitment.
          </p>
        </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">
              <Users />
            </div>
            <h3>Equal Access</h3>
            <p>
              We promote access to job opportunities across different industries,
              skill levels, and backgrounds.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <Scale />
            </div>
            <h3>Fair Practices</h3>
            <p>
              We encourage ethical, honest, and non-discriminatory recruitment
              practices from employers.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <ShieldCheck />
            </div>
            <h3>Safe Platform</h3>
            <p>
              We are committed to improving trust, reviewing suspicious activity,
              and protecting users.
            </p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card dark-card">
          <HeartHandshake />
          <span>Our Core Principles</span>
          <h2>JoblyHub is guided by responsibility and integrity.</h2>
          <p>
            We aim to create a system where opportunities are accessible and
            hiring processes are straightforward, respectful, and fair.
          </p>

          <div className="safety-points">
            <p>
              <CheckCircle2 size={18} />
              Promoting equal access to job opportunities.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Supporting ethical and transparent recruitment.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Providing a safe and reliable platform.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Contributing to economic growth through employment access.
            </p>
          </div>
        </div>

        <div className="split-card light-card">
          <Eye />
          <h3>Fair Employment Practices</h3>

          <div className="mini-faq">
            <h4>What we encourage</h4>
            <p>
              Employers should provide accurate job descriptions, fair hiring
              processes, and respectful communication with applicants.
            </p>
          </div>

          <div className="mini-faq">
            <h4>What we do not support</h4>
            <p>
              JoblyHub does not support misleading job postings, exploitative
              working conditions, or discriminatory hiring practices.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>Accessibility & Inclusion</span>
          <h2>Everyone deserves a fair chance to find meaningful work.</h2>
          <p>
            JoblyHub is designed to reduce barriers and make opportunities more
            accessible to a wider audience.
          </p>
        </div>

        <div className="help-grid">
          <div className="help-card">
            <Globe2 />
            <h3>Wider Access</h3>
            <p>
              We strive to make job opportunities easier to discover for people
              across different locations and backgrounds.
            </p>
          </div>

          <div className="help-card">
            <BriefPointIcon />
            <h3>Different Skill Levels</h3>
            <p>
              JoblyHub supports both entry-level and experienced job seekers
              looking for meaningful opportunities.
            </p>
          </div>

          <div className="help-card">
            <Building2 />
            <h3>Business Support</h3>
            <p>
              We help employers reach qualified candidates, simplify hiring, and
              improve recruitment outcomes.
            </p>
          </div>

          <div className="help-card">
            <Handshake />
            <h3>Community Impact</h3>
            <p>
              By connecting people to opportunities, JoblyHub contributes to
              stronger communities and economic development.
            </p>
          </div>
        </div>
      </section>

      <section className="platform-benefits">
        <div className="section-heading">
          <span>Transparency & Trust</span>
          <h2>Trust is at the core of our platform.</h2>
          <p>
            We are committed to clear communication, accurate information, and
            action against suspicious or fraudulent activity.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-item">
            <CheckCircle2 />
            <p>Clear and honest communication</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Accurate information for users</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Action against suspicious activity</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Continuous safety improvement</p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <RefreshCw />
          <h3>Continuous Improvement</h3>
          <p>
            We are committed to listening to user feedback, improving the user
            experience, and introducing features that improve transparency and
            efficiency.
          </p>

          <div className="mini-faq">
            <h4>Our goal</h4>
            <p>
              To build a platform that evolves with the needs of job seekers and
              employers.
            </p>
          </div>
        </div>

        <div className="split-card dark-card">
          <ShieldCheck />
          <span>Our Responsibility to You</span>
          <h2>We want JoblyHub to be a platform users can trust.</h2>
          <p>
            As a platform, we recognize our role in shaping how opportunities are
            shared and accessed. We are committed to acting responsibly,
            maintaining integrity, and building a trusted ecosystem.
          </p>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>JoblyHub is more than a job platform.</h2>
          <p>
            It is a growing ecosystem focused on opportunity, fairness, and
            progress.
          </p>
        </div>
      </section>
    </InfoPage>
  );
}

function BriefPointIcon() {
  return <CheckCircle2 />;
}