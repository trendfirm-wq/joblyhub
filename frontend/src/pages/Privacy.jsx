import {
  Database,
  FileText,
  Lock,
  Share2,
  ShieldCheck,
  UserCheck,
  Cookie,
  ExternalLink,
  Clock,
  Edit3,
  RefreshCw,
  Mail,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import InfoPage from "./InfoPage";

export default function Privacy() {
  return (
    <InfoPage
      eyebrow="Privacy Policy"
      title="How JoblyHub handles and protects user information."
      subtitle="At JoblyHub, we value your privacy and are committed to protecting your personal information when you use our platform."
      badge="Privacy & data protection"
    >
      <section className="premium-section">
        <div className="section-heading">
          <span>Our Privacy Promise</span>
          <h2>We collect information responsibly and use it to improve your experience.</h2>
          <p>
            By using JoblyHub, users agree to the terms outlined in this Privacy
            Policy. This page explains what we collect, how we use it, and how we
            safeguard user data.
          </p>
        </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="mission-icon">
              <Database />
            </div>
            <h3>Information We Collect</h3>
            <p>
              We may collect personal, professional, and usage information needed
              to provide job listing, account, and application services.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <ShieldCheck />
            </div>
            <h3>How We Protect Data</h3>
            <p>
              We take reasonable measures to protect user information from
              unauthorized access, misuse, alteration, or disclosure.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-icon">
              <UserCheck />
            </div>
            <h3>User Responsibility</h3>
            <p>
              Users should provide accurate information, keep login details
              secure, and verify employers before sharing sensitive details.
            </p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <FileText />
          <h3>1. Information We Collect</h3>

          <div className="mini-faq">
            <h4>Personal Information</h4>
            <p>
              This may include your full name, email address, phone number if
              provided, and account login details.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Professional Information</h4>
            <p>
              This may include CV or resume details, work experience, skills,
              qualifications, and job preferences.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Usage Information</h4>
            <p>
              This may include pages visited, interactions with job listings,
              and device or browser information.
            </p>
          </div>
        </div>

        <div className="split-card dark-card">
          <Database />
          <span>2. How We Use Information</span>
          <h2>Your information helps us operate and improve JoblyHub.</h2>

          <div className="safety-points">
            <p>
              <CheckCircle2 size={18} />
              Provide access to job listings and platform services.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Connect job seekers with employers.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Improve user experience and platform performance.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Send updates, opportunities, and support messages.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Monitor and prevent fraudulent or suspicious activity.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>Data Sharing</span>
          <h2>3. Sharing of information</h2>
          <p>
            JoblyHub does not sell your personal data. However, some information
            may be shared when needed to provide our services or comply with the
            law.
          </p>
        </div>

        <div className="help-grid">
          <div className="help-card">
            <Share2 />
            <h3>With Employers</h3>
            <p>
              Your information may be shared with employers when you apply for a
              job or choose to submit application details.
            </p>
          </div>

          <div className="help-card">
            <ShieldCheck />
            <h3>With Service Providers</h3>
            <p>
              We may work with service providers who help operate, maintain, and
              improve the JoblyHub platform.
            </p>
          </div>

          <div className="help-card">
            <Lock />
            <h3>Legal Requirements</h3>
            <p>
              Information may be shared when required by law, regulation, or
              valid legal processes.
            </p>
          </div>

          <div className="help-card">
            <AlertTriangle />
            <h3>No Sale of Data</h3>
            <p>
              JoblyHub does not sell personal data to third parties.
            </p>
          </div>
        </div>
      </section>

      <section className="platform-benefits">
        <div className="section-heading">
          <span>Security</span>
          <h2>4. Data protection and security</h2>
          <p>
            We take reasonable technical and organizational steps to protect user
            data. However, no online system is completely secure, so users should
            also take precautions when sharing personal information online.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-item">
            <CheckCircle2 />
            <p>Protection against unauthorized access</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Prevention of data loss or misuse</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Protection against alteration</p>
          </div>

          <div className="benefit-item">
            <CheckCircle2 />
            <p>Reduced risk of improper disclosure</p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <UserCheck />
          <h3>5. User Responsibility</h3>
          <p>
            Users are responsible for providing accurate information, keeping
            login credentials secure, and verifying employers before sharing
            sensitive details.
          </p>

          <div className="mini-faq">
            <h4>Third-party sharing</h4>
            <p>
              JoblyHub is not responsible for misuse of information that users
              share directly with employers or other third parties.
            </p>
          </div>
        </div>

        <div className="split-card light-card">
          <Cookie />
          <h3>6. Cookies & Tracking</h3>
          <p>
            We may use cookies and similar technologies to improve website
            functionality, understand user behavior, and enhance the overall user
            experience.
          </p>

          <div className="mini-faq">
            <h4>Managing cookies</h4>
            <p>
              You can manage cookie preferences through your browser settings.
            </p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card dark-card">
          <ExternalLink />
          <span>7. Third-Party Links</span>
          <h2>External websites may have different privacy practices.</h2>
          <p>
            JoblyHub may contain links to external websites or employer pages.
            We are not responsible for the privacy practices or content of those
            third-party sites.
          </p>
        </div>

        <div className="split-card light-card">
          <Clock />
          <h3>8. Data Retention</h3>
          <p>
            We retain information only for as long as necessary to provide our
            services, comply with legal obligations, and resolve disputes.
          </p>

          <div className="mini-faq">
            <h4>Data deletion</h4>
            <p>
              Users may request deletion of their data at any time by contacting
              JoblyHub.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading left">
          <span>User Rights</span>
          <h2>9. Your rights</h2>
          <p>
            Users may contact JoblyHub to make privacy-related requests. We will
            respond within a reasonable timeframe.
          </p>
        </div>

        <div className="faq-list">
          <div className="faq-item">
            <h3>Access your personal data</h3>
            <p>
              You may request access to the personal information JoblyHub holds
              about you.
            </p>
          </div>

          <div className="faq-item">
            <h3>Request correction</h3>
            <p>
              You may request correction of inaccurate or outdated information.
            </p>
          </div>

          <div className="faq-item">
            <h3>Request deletion</h3>
            <p>
              You may request deletion of your data where applicable.
            </p>
          </div>

          <div className="faq-item">
            <h3>Withdraw consent</h3>
            <p>
              Where consent applies, you may withdraw it by contacting JoblyHub.
            </p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <RefreshCw />
          <h3>10. Policy Updates</h3>
          <p>
            This Privacy Policy may be updated periodically to reflect changes in
            our services or legal requirements. Users are encouraged to review
            this page regularly.
          </p>
        </div>

        <div className="split-card light-card">
          <Mail />
          <h3>11. Contact Us</h3>
          <p>
            If you have questions about this Privacy Policy or how your data is
            handled, please contact JoblyHub through the Contact page.
          </p>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>12. Disclaimer</h2>
          <p>
            JoblyHub acts as a platform connecting job seekers and employers. We
            do not control how employers use information shared with them during
            job applications. Users should exercise caution and verify
            opportunities before sharing personal or sensitive data.
          </p>
        </div>
      </section>
    </InfoPage>
  );
}