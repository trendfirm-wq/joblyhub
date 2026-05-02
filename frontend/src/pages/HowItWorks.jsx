import {
  Briefcase,
  Building2,
  CheckCircle2,
  Rocket,
  Target,
  Search,
  Send,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  Mail,
} from "lucide-react";
import InfoPage from "./InfoPage";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <InfoPage
      eyebrow="How It Works"
      title="Simple tools for job seekers and employers."
      subtitle="JoblyHub provides simple, effective solutions that help job seekers find opportunities and enable employers to hire the right talent quickly."
      badge="Recruitment made easier"
    >
      <section className="premium-section">
        <div className="section-heading">
          <span>Our Services</span>
          <h2>Making recruitment easier, faster, and more accessible.</h2>
          <p>
            JoblyHub is designed to reduce stress for job seekers and simplify
            hiring for employers across Ghana.
          </p>
        </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">
              <Search />
            </div>
            <h3>Job Search & Discovery</h3>
            <p>
              Browse job opportunities across different industries and
              locations through a simple and efficient platform.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <Send />
            </div>
            <h3>Easy Job Applications</h3>
            <p>
              Apply to jobs quickly with clear instructions and a streamlined
              process that saves time and effort.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <Briefcase />
            </div>
            <h3>Career Opportunities</h3>
            <p>
              Access opportunities from startups, SMEs, established companies,
              and growing organizations.
            </p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <Users />
          <h3>For Job Seekers</h3>

          <div className="mini-faq">
            <h4>Find relevant jobs</h4>
            <p>
              Browse opportunities and discover roles that match your skills,
              location, and career goals.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Apply with confidence</h4>
            <p>
              Each job provides clear application instructions so you know what
              to do next.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Better experience over time</h4>
            <p>
              JoblyHub will continue improving to make job searching easier and
              more effective.
            </p>
          </div>
        </div>

        <div className="split-card dark-card">
          <Building2 />
          <span>For Employers</span>
          <h2>Post jobs and reach qualified candidates faster.</h2>
          <p>
            Employers can post job openings, increase visibility, and connect
            with candidates through a clean and accessible platform.
          </p>

          <div className="safety-points">
            <p>
              <CheckCircle2 size={18} />
              Post job openings across Ghana.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Reach a growing pool of job seekers.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Promote featured listings for better visibility.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Get optional support with structuring job listings.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>Future & Scalable</span>
          <h2>Advanced services as JoblyHub grows</h2>
          <p>
            JoblyHub is starting simple, but the platform is built to grow with
            more powerful recruitment features over time.
          </p>
        </div>

        <div className="help-grid">
          <div className="help-card">
            <Rocket />
            <h3>Candidate Matching</h3>
            <p>
              Future tools may help match job seekers with opportunities that
              fit their skills and interests.
            </p>
          </div>

          <div className="help-card">
            <Sparkles />
            <h3>Employer Branding</h3>
            <p>
              Employers may be able to create company profiles to build trust
              and attract better candidates.
            </p>
          </div>

          <div className="help-card">
            <TrendingUp />
            <h3>Talent Sourcing</h3>
            <p>
              JoblyHub may support employers with finding suitable candidates
              more efficiently.
            </p>
          </div>

          <div className="help-card">
            <BarChart3 />
            <h3>Hiring Insights</h3>
            <p>
              Analytics and insights may help employers understand listing
              performance and hiring activity.
            </p>
          </div>
        </div>
      </section>

      <section className="platform-benefits">
        <div className="section-heading">
          <span>Platform Benefits</span>
          <h2>Built for simplicity, speed, and trust.</h2>
        </div>

        <div className="benefits-grid">
          <div className="benefit-item">
            <CheckCircle2 />
            <p>A simple and clean user experience</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Faster access to job opportunities</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Efficient recruitment for employers</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>A reliable platform for connecting talent and businesses</p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card dark-card">
          <Target />
          <span>Our Approach</span>
          <h2>We focus on real value, not complexity.</h2>
          <p>
            JoblyHub is built around simplicity, speed, trust, transparency, and
            meaningful value for both job seekers and employers.
          </p>
        </div>

        <div className="split-card light-card">
          <Mail />
          <h3>Ready to get started?</h3>
          <p>
            Whether you are looking for a job or hiring talent, JoblyHub gives
            you the tools to move forward.
          </p>

          <div className="cta-actions mt-actions">
            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>

            <Link to="/register" className="btn btn-ghost">
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </InfoPage>
  );
}