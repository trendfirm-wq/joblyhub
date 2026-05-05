import {
  Briefcase,
  Building2,
  CheckCircle2,
  Users,
  Search,
  Target,
  ShieldCheck,
  Rocket,
  Eye,
  Handshake,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import InfoPage from "./InfoPage";
import { Link } from "react-router-dom";

import PageTitle from '../components/PageTitle';


export default function About() {
  return (
    <InfoPage
      eyebrow="About JoblyHub"
      title="A smarter way to connect jobs, employers, and talent."
      subtitle="JoblyHub is a modern job platform built to connect job seekers with real opportunities and help employers find the right talent faster."
      badge="Built for Ghana’s job market"
    >
      <section className="premium-section">
        <div className="section-heading left">
          <span>Who We Are</span>
          <h2>Making job searching and hiring easier, faster, and more reliable.</h2>
          <p>
            JoblyHub was created to simplify how people find jobs and how
            businesses hire. We recognized that many job platforms are often
            cluttered, outdated, or difficult to navigate, making the process
            frustrating for both job seekers and employers.
          </p>
        </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">
              <Search />
            </div>
            <h3>Clarity</h3>
            <p>
              We focus on clean job listings, clear information, and a simple
              platform experience for users.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <Target />
            </div>
            <h3>Efficiency</h3>
            <p>
              JoblyHub helps job seekers find opportunities faster and helps
              employers reach talent more easily.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <ShieldCheck />
            </div>
            <h3>Accessibility</h3>
            <p>
              We are building a platform where opportunities are easier to find
              and hiring is more straightforward.
            </p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card dark-card">
          <Eye />
          <span>What We Do</span>
          <h2>JoblyHub provides a centralized space for opportunity and hiring.</h2>
          <p>
            Our platform is designed to remove unnecessary barriers and make the
            hiring process more direct and effective for both sides.
          </p>

          <div className="safety-points">
            <p>
              <CheckCircle2 size={18} />
              Job seekers can discover and apply for opportunities across
              various industries.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Employers can post job openings and reach qualified candidates.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Both sides can connect in a simple and efficient way.
            </p>
          </div>
        </div>

        <div className="split-card light-card">
          <Users />
          <h3>Supporting job seekers</h3>

          <div className="mini-faq">
            <h4>Easy access to jobs</h4>
            <p>
              JoblyHub helps job seekers find opportunities without unnecessary
              complications.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Straightforward application process</h4>
            <p>
              We aim to make applications clearer, simpler, and easier to
              follow.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Respect for time and effort</h4>
            <p>
              We believe job seekers deserve a platform that helps them move
              forward with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="section-heading">
          <span>Our Approach</span>
          <h2>We believe job searching and recruitment should not be complicated.</h2>
          <p>
            JoblyHub focuses on delivering value without unnecessary complexity.
            The platform is built around simplicity, speed, clarity, and access.
          </p>
        </div>

        <div className="help-grid">
          <div className="help-card">
            <Sparkles />
            <h3>Simplicity</h3>
            <p>
              A clean and easy-to-use platform for job seekers and employers.
            </p>
          </div>

          <div className="help-card">
            <Rocket />
            <h3>Speed</h3>
            <p>
              Faster access to opportunities for job seekers and candidates for
              employers.
            </p>
          </div>

          <div className="help-card">
            <Briefcase />
            <h3>Clarity</h3>
            <p>
              Well-structured job listings and information that users can
              understand quickly.
            </p>
          </div>

          <div className="help-card">
            <Handshake />
            <h3>Accessibility</h3>
            <p>
              Opportunities for people at different career levels and skill
              stages.
            </p>
          </div>
        </div>
      </section>

      <section className="platform-benefits">
        <div className="section-heading">
          <span>Our Commitment</span>
          <h2>We are committed to building a reliable and trusted platform.</h2>
          <p>
            JoblyHub encourages responsible and ethical recruitment practices
            while supporting businesses and individuals.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-item">
            <CheckCircle2 />
            <p>Providing a reliable and user-friendly platform</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Promoting genuine and transparent job opportunities</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Supporting businesses in finding the right talent</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Helping individuals access meaningful employment</p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <Building2 />
          <h3>Supporting Employers</h3>
          <p>
            We understand the challenges businesses face when trying to find the
            right candidates. JoblyHub helps employers improve visibility and
            reach a wider pool of job seekers.
          </p>

          <div className="mini-faq">
            <h4>Reach more candidates</h4>
            <p>
              Share opportunities with a growing audience of job seekers across
              Ghana.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Post quickly and effectively</h4>
            <p>
              Employers can publish opportunities through a clean and structured
              process.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Improve listing visibility</h4>
            <p>
              JoblyHub is built to help opportunities appear clearly and
              professionally.
            </p>
          </div>
        </div>

        <div className="split-card dark-card">
          <TrendingUp />
          <span>Building for the Future</span>
          <h2>JoblyHub is continuously evolving.</h2>
          <p>
            As we grow, we aim to introduce new features that improve how job
            seekers and employers connect, making the platform even more
            efficient and valuable.
          </p>

          <div className="safety-points">
            <p>
              <CheckCircle2 size={18} />
              Better dashboards for job seekers and employers.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Improved job discovery and application tools.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Features that support trust, simplicity, and better hiring.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Our Vision</h2>
          <p>
            Our vision is to become a trusted platform for job opportunities and
            talent discovery, helping to bridge the gap between employers and job
            seekers while contributing to economic growth and employment access.
          </p>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>Ready to explore opportunities?</h2>
          <p>
            JoblyHub is more than just a job platform — it is a growing hub for
            opportunity, connection, and progress.
          </p>
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