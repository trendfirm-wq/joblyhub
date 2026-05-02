import {
  Briefcase,
  Building2,
  HelpCircle,
  Mail,
  Search,
  ShieldCheck,
  User,
  Lock,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";
import InfoPage from "./InfoPage";
import { Link } from "react-router-dom";

export default function HelpCenter() {
  return (
    <InfoPage
      eyebrow="Help Center"
      title="Everything you need to use JoblyHub confidently."
      subtitle="Find quick answers for job seekers, employers, applications, account support, and safety."
      badge="Support & guidance"
    >
      <section className="help-grid">
        <div className="help-card">
          <Search />
          <h3>Find Jobs</h3>
          <p>
            Browse available opportunities and use filters to narrow your search
            by category, location, or job type.
          </p>
        </div>

        <div className="help-card">
          <Briefcase />
          <h3>Apply Easily</h3>
          <p>
            Open a job listing, read the full details, and follow the application
            instructions provided.
          </p>
        </div>

        <div className="help-card">
          <Building2 />
          <h3>Post Jobs</h3>
          <p>
            Employers can post jobs, receive applications, and manage listings
            through JoblyHub.
          </p>
        </div>

        <div className="help-card">
          <ShieldCheck />
          <h3>Stay Safe</h3>
          <p>
            JoblyHub does not charge job seekers to browse or apply for jobs.
            Always be careful with suspicious offers.
          </p>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>For Job Seekers</span>
          <h2>Finding and applying for jobs</h2>
          <p>
            These answers help job seekers understand how to browse, apply, and
            improve their chances of getting hired.
          </p>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <h3>How do I find jobs on JoblyHub?</h3>
            <p>
              Visit the homepage to view job listings. You can browse available
              opportunities or use filters to narrow your search by category,
              location, or job type.
            </p>
          </div>

          <div className="faq-item">
            <h3>Do I need an account to apply for jobs?</h3>
            <p>
              You can browse jobs without an account. However, creating an
              account lets you apply faster, track your applications, and manage
              your profile.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I apply for a job?</h3>
            <p>
              Click on any job listing to view the full details. Then follow the
              application instructions provided. This may include submitting your
              CV or contacting the employer directly.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I apply for multiple jobs?</h3>
            <p>
              Yes. You can apply to as many jobs as you are qualified for. We
              recommend applying only to roles that match your skills and
              experience.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I improve my chances of getting hired?</h3>
            <p>
              Keep your CV updated, apply to relevant roles, follow application
              instructions carefully, and avoid sending incomplete applications.
            </p>
          </div>

          <div className="faq-item">
            <h3>Are all jobs on JoblyHub verified?</h3>
            <p>
              JoblyHub aims to maintain quality listings, but users should still
              verify employer details and avoid suspicious offers.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>For Employers</span>
          <h2>Posting and managing job listings</h2>
          <p>
            Employers can publish job opportunities, receive applications, and
            manage listings professionally.
          </p>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <h3>How do I post a job on JoblyHub?</h3>
            <p>
              You can use the Post a Job section or contact JoblyHub directly.
              The team can also assist you in publishing your job listing
              quickly.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is it free to post jobs?</h3>
            <p>
              JoblyHub may offer free listings during the early phase. Premium
              and featured listings may require payment for increased visibility.
            </p>
          </div>

          <div className="faq-item">
            <h3>How will I receive applications?</h3>
            <p>
              Applications may be sent directly to your email or managed through
              your employer dashboard, depending on the setup.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I edit or remove a job listing?</h3>
            <p>
              Yes. Employers can request changes or remove a job listing at any
              time.
            </p>
          </div>

          <div className="faq-item">
            <h3>How can I attract better candidates?</h3>
            <p>
              Write clear job descriptions, specify required skills and
              qualifications, and respond to applicants promptly.
            </p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <User />
          <h3>Account & Technical Questions</h3>

          <div className="mini-faq">
            <h4>How do I create an account?</h4>
            <p>
              Click the sign-up option and follow the registration steps. You may
              need to verify your email before accessing all features.
            </p>
          </div>

          <div className="mini-faq">
            <h4>I forgot my password. What should I do?</h4>
            <p>
              Use the Forgot Password option on the login page and follow the
              instructions sent to your email.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Why am I not receiving emails from JoblyHub?</h4>
            <p>
              Check your spam or junk folder, confirm your email address is
              correct, and add JoblyHub to your contacts.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Can I update my profile information?</h4>
            <p>
              Yes. You can update your details anytime from your account
              settings.
            </p>
          </div>
        </div>

        <div className="split-card dark-card">
          <Lock />
          <span>Safety & Trust</span>
          <h2>Protect yourself from suspicious job offers.</h2>

          <div className="safety-points">
            <p>
              <CheckCircle2 size={18} />
              JoblyHub does not charge job seekers to browse or apply for jobs.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Be careful if you are asked to pay money before getting a job.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Be cautious when a job offer sounds unrealistic or communication
              looks unprofessional.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Report suspicious jobs through the Contact page so JoblyHub can
              investigate.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>General Questions</span>
          <h2>More about JoblyHub</h2>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <h3>What is JoblyHub?</h3>
            <p>
              JoblyHub is a modern job platform designed to connect job seekers
              with employers in a simple and efficient way.
            </p>
          </div>

          <div className="faq-item">
            <h3>How can I contact JoblyHub?</h3>
            <p>
              You can reach JoblyHub through the Contact page for support,
              enquiries, or job posting assistance.
            </p>
          </div>

          <div className="faq-item">
            <h3>Will more features be added in the future?</h3>
            <p>
              Yes. JoblyHub is continuously improving, and new features will be
              introduced to enhance the user experience.
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