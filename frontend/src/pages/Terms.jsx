import {
  AlertTriangle,
  Ban,
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  FileText,
  Gavel,
  Lock,
  Mail,
  RefreshCw,
  Scale,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";
import InfoPage from "./InfoPage";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <InfoPage
      eyebrow="Terms of Use"
      title="Rules and conditions for using JoblyHub."
      subtitle="By accessing or using JoblyHub, you agree to comply with and be bound by these Terms & Conditions."
      badge="Terms & conditions"
    >
      <section className="premium-section">
        <div className="section-heading">
          <span>Welcome to JoblyHub</span>
          <h2>Please read these terms carefully before using the platform.</h2>
          <p>
            These Terms explain your responsibilities, JoblyHub’s role, platform
            rules, payments, limitations, privacy, and other important conditions.
          </p>
        </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">
              <CheckCircle2 />
            </div>
            <h3>1. Acceptance of Terms</h3>
            <p>
              By using JoblyHub, you confirm that you have read, understood, and
              agreed to these Terms & Conditions.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <Briefcase />
            </div>
            <h3>2. Description of Service</h3>
            <p>
              JoblyHub is an online platform that connects job seekers with
              employers through job listings and recruitment-related services.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <UserCheck />
            </div>
            <h3>3. User Eligibility</h3>
            <p>
              By using JoblyHub, you confirm that you are legally capable of
              entering agreements and that your information is accurate.
            </p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <Lock />
          <h3>4. User Accounts</h3>
          <p>
            Users may be required to create an account to access certain
            features. You are responsible for keeping your account secure.
          </p>

          <div className="mini-faq">
            <h4>Your account responsibilities</h4>
            <p>
              Keep your login details secure, provide accurate and updated
              information, and notify JoblyHub if you suspect unauthorized use of
              your account.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Unauthorized access</h4>
            <p>
              JoblyHub is not responsible for losses resulting from unauthorized
              access caused by failure to protect your login details.
            </p>
          </div>
        </div>

        <div className="split-card dark-card">
          <Building2 />
          <span>5. Job Listings</span>
          <h2>Employers and job seekers both have responsibilities.</h2>

          <div className="safety-points">
            <p>
              <CheckCircle2 size={18} />
              Employers must provide accurate and complete job information.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Employers must not post misleading, fraudulent, or illegal job
              offers.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Job seekers are responsible for evaluating job opportunities
              before applying.
            </p>

            <p>
              <CheckCircle2 size={18} />
              Job seekers should verify employer details independently.
            </p>
          </div>
        </div>
      </section>

      <section className="warning-panel">
        <div className="warning-icon">
          <AlertTriangle />
        </div>

        <div>
          <h2>Job listing disclaimer</h2>
          <p>
            JoblyHub does not guarantee the authenticity, accuracy, or
            availability of job listings. Users should exercise caution and make
            informed decisions before applying or sharing personal information.
          </p>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>Application Process</span>
          <h2>6. JoblyHub does not control hiring decisions.</h2>
          <p>
            JoblyHub does not guarantee job placement, influence hiring
            decisions, or participate in employer selection processes. All
            recruitment decisions are made solely by employers.
          </p>
        </div>

        <div className="help-grid">
          <div className="help-card">
            <XCircle />
            <h3>No Job Guarantee</h3>
            <p>
              JoblyHub does not guarantee employment, interview opportunities, or
              job placement outcomes.
            </p>
          </div>

          <div className="help-card">
            <Building2 />
            <h3>Employer Decisions</h3>
            <p>
              Employers independently make recruitment, interview, and hiring
              decisions.
            </p>
          </div>

          <div className="help-card">
            <FileText />
            <h3>Application Accuracy</h3>
            <p>
              Job seekers should submit truthful, complete, and accurate
              application information.
            </p>
          </div>

          <div className="help-card">
            <ShieldCheck />
            <h3>Use With Caution</h3>
            <p>
              Users should verify opportunities and avoid sharing sensitive
              information too early.
            </p>
          </div>
        </div>
      </section>

      <section className="platform-benefits">
        <div className="section-heading">
          <span>7. Prohibited Activities</span>
          <h2>Users must not misuse the platform.</h2>
          <p>
            Violation of these rules may result in account suspension, content
            removal, or restricted access.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-item">
            <Ban />
            <p>Do not post false or misleading information</p>
          </div>

          <div className="benefit-item">
            <Ban />
            <p>Do not engage in fraudulent or illegal activities</p>
          </div>

          <div className="benefit-item">
            <Ban />
            <p>Do not attempt to access restricted areas</p>
          </div>

          <div className="benefit-item">
            <Ban />
            <p>Do not disrupt or interfere with platform functionality</p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <CreditCard />
          <h3>8. Payments & Services</h3>
          <p>
            Certain services, such as job postings or premium listings, may
            require payment.
          </p>

          <div className="mini-faq">
            <h4>Fees and pricing</h4>
            <p>
              All fees are clearly stated before purchase. JoblyHub reserves the
              right to modify pricing at any time.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Refunds</h4>
            <p>
              Payments are non-refundable once services are delivered.
            </p>
          </div>
        </div>

        <div className="split-card light-card">
          <FileText />
          <h3>9. Intellectual Property</h3>
          <p>
            All content on JoblyHub, including website design, logos, text, and
            graphics, is owned by JoblyHub or its licensors.
          </p>

          <div className="mini-faq">
            <h4>Use of JoblyHub content</h4>
            <p>
              JoblyHub content may not be copied, modified, or distributed
              without permission.
            </p>
          </div>
        </div>
      </section>

      <section className="warning-panel danger-panel">
        <div className="warning-icon">
          <Scale />
        </div>

        <div>
          <h2>10. Limitation of liability</h2>
          <p>
            JoblyHub shall not be held responsible for any loss or damage arising
            from job applications, employer or job seeker actions, or misuse of
            information by third parties. Users agree to use the platform at
            their own risk.
          </p>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card dark-card">
          <ExternalLink />
          <span>11. Third-Party Interactions</span>
          <h2>External services are outside JoblyHub’s control.</h2>
          <p>
            JoblyHub may contain links to third-party websites or services. We do
            not control or endorse these external platforms and are not
            responsible for their content or actions.
          </p>
        </div>

        <div className="split-card light-card">
          <ShieldCheck />
          <h3>12. Suspension & Termination</h3>
          <p>
            JoblyHub reserves the right to suspend or terminate user accounts,
            remove job listings or content, and restrict access to the platform
            if users violate these Terms or engage in suspicious activities.
          </p>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>Privacy, Updates & Law</span>
          <h2>Additional legal terms</h2>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <h3>13. Privacy</h3>
            <p>
              Your use of JoblyHub is also governed by our Privacy Policy, which
              explains how your data is collected and used.
            </p>
          </div>

          <div className="faq-item">
            <h3>14. Changes to Terms</h3>
            <p>
              JoblyHub may update these Terms & Conditions at any time.
              Continued use of the platform after changes indicates acceptance
              of the updated terms.
            </p>
          </div>

          <div className="faq-item">
            <h3>15. Governing Law</h3>
            <p>
              These Terms shall be governed by and interpreted in accordance with
              the laws of Ghana.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>16. Disclaimer</h2>
          <p>
            JoblyHub is a job listing platform and does not act as an employer or
            recruitment agency. We do not guarantee job availability, interview
            opportunities, or employment outcomes. Users are advised to exercise
            caution and conduct due diligence when interacting with employers.
          </p>
        </div>
      </section>

      <section className="support-strip">
        <Mail />
        <div>
          <h2>17. Contact Information</h2>
          <p>
            For questions regarding these Terms & Conditions, contact JoblyHub
            through the Contact page.
          </p>
        </div>

        <Link to="/contact" className="btn btn-primary">
          Contact Us
        </Link>
      </section>
    </InfoPage>
  );
}