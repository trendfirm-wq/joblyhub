import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  Eye,
  Lock,
  Building2,
  MessageCircleWarning,
  FileWarning,
  HandCoins,
  Ban,
  Mail,
} from "lucide-react";
import InfoPage from "./InfoPage";
import { Link } from "react-router-dom";

export default function Safety() {
  return (
    <InfoPage
      eyebrow="Safety & Fraud Alert"
      title="Stay safe when searching and applying for jobs."
      subtitle="JoblyHub is committed to providing a safe and reliable platform, but users should always exercise caution when interacting with job opportunities."
      badge="User safety first"
    >
      <section className="warning-panel">
        <div className="warning-icon">
          <ShieldAlert />
        </div>

        <div>
          <h2>Important safety notice</h2>
          <p>
            JoblyHub does not charge job seekers to apply for jobs, does not
            request payment for job offers, and does not ask for sensitive
            financial information during applications.
          </p>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card dark-card">
          <Eye />
          <span>1. Platform Disclaimer</span>
          <h2>JoblyHub acts as an intermediary between job seekers and employers.</h2>
          <p>
            JoblyHub does not participate in the recruitment or hiring process,
            does not guarantee job placement or interview opportunities, and
            does not verify every employer or job listing in real time.
          </p>

          <div className="safety-points">
            <p>
              <CheckCircle2 size={18} />
              Hiring decisions are made independently by employers.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Users are responsible for evaluating opportunities carefully.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Users should make informed decisions before sharing information.
            </p>
          </div>
        </div>

        <div className="split-card light-card">
          <HandCoins />
          <h3>2. Important Notice to Job Seekers</h3>

          <div className="mini-faq">
            <h4>JoblyHub does not charge job seekers</h4>
            <p>
              You should not pay any fee to apply for jobs, attend interviews,
              receive job offers, or secure placements through JoblyHub.
            </p>
          </div>

          <div className="mini-faq">
            <h4>If you are asked to pay money</h4>
            <p>
              Treat it as a serious warning sign. Fraudulent offers may request
              processing, training, application, or placement fees.
            </p>
          </div>

          <div className="mini-faq">
            <h4>Protect sensitive information</h4>
            <p>
              Do not share bank details, passwords, PINs, or sensitive financial
              information during job applications.
            </p>
          </div>
        </div>
      </section>
<div className="mini-faq" style={{ visibility: "hidden" }}>
  <h4>Protect sensitive information</h4>
  
</div>
      <section className="safety-grid">
        <div className="safety-card danger">
          <AlertTriangle />
          <h3>Be careful if someone asks for money</h3>
          <p>
            A legitimate employer should not require payment at any stage of the
            recruitment process.
          </p>
        </div>

        <div className="safety-card danger">
          <XCircle />
          <h3>Avoid unrealistic promises</h3>
          <p>
            Be cautious of offers promising very high pay with little effort or
            unclear responsibilities.
          </p>
        </div>

        <div className="safety-card danger">
          <MessageCircleWarning />
          <h3>Watch unofficial communication</h3>
          <p>
            Be careful if you are contacted through unofficial channels with
            urgent payment or personal data requests.
          </p>
        </div>

        <div className="safety-card danger">
          <FileWarning />
          <h3>Check vague job descriptions</h3>
          <p>
            Be cautious when the job description lacks company details, clear
            duties, or proper contact information.
          </p>
        </div>

        <div className="safety-card safe">
          <ShieldCheck />
          <h3>Check employer details</h3>
          <p>
            Review the company name, website, contact details, and application
            instructions before applying.
          </p>
        </div>

        <div className="safety-card safe">
          <CheckCircle2 />
          <h3>Use official channels</h3>
          <p>
            Apply through the email, website, or platform method shown on the job
            details page.
          </p>
        </div>
      </section>

      <section className="checklist-section">
        <div className="section-heading left">
          <span>3. Common Signs of Job Scams</span>
          <h2>Be cautious before you proceed.</h2>
          <p>
            Fraudulent job offers often try to collect personal or financial
            information, request fees, or pressure job seekers with unrealistic
            promises.
          </p>
        </div>

        <div className="checklist">
          <div>You are asked to pay money at any stage of recruitment.</div>
          <div>The job offer seems too good to be true.</div>
          <div>The employer avoids proper interviews or clear communication.</div>
          <div>You are contacted through unofficial channels with urgent requests.</div>
          <div>The job description is vague or lacks company details.</div>
        </div>
      </section>

      <section className="platform-benefits">
        <div className="section-heading">
          <span>4. Protecting Yourself</span>
          <h2>Your awareness is your first protection.</h2>
          <p>
            Job seekers should take personal responsibility for their safety when
            engaging with potential employers.
          </p>
        </div>

        <div className="benefits-grid">
          <div className="benefit-item">
            <Ban />
            <p>Never pay money to secure a job opportunity</p>
          </div>

          <div className="benefit-item">
            <Lock />
            <p>Do not share bank details, passwords, or sensitive information</p>
          </div>

          <div className="benefit-item">
            <Building2 />
            <p>Research companies independently before proceeding</p>
          </div>

          <div className="benefit-item">
            <ShieldCheck />
            <p>Use official communication and application channels</p>
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="split-card light-card">
          <Building2 />
          <h3>5. Employer Responsibility</h3>
          <p>
            Employers using JoblyHub must provide accurate and truthful job
            information, conduct recruitment processes ethically, and avoid
            requesting payments from candidates.
          </p>

          <div className="mini-faq">
            <h4>Fraudulent employers</h4>
            <p>
              Any employer found engaging in fraudulent or misleading practices
              may be removed from the platform.
            </p>
          </div>
        </div>

        <div className="split-card dark-card">
          <Mail />
          <span>6. Reporting Suspicious Activity</span>
          <h2>Seen something suspicious? Report it quickly.</h2>
          <p>
            If you encounter a suspicious job listing or believe you have been
            targeted by a scam, contact JoblyHub immediately and avoid further
            interaction with the suspected party.
          </p>

          <div className="safety-points">
            <p>
              <CheckCircle2 size={18} />
              Provide details of the job listing.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Share details of the suspicious communication.
            </p>
            <p>
              <CheckCircle2 size={18} />
              Avoid further engagement with the suspected party.
            </p>
            <p>
              <CheckCircle2 size={18} />
              JoblyHub will investigate reports to maintain platform integrity.
            </p>
          </div>
        </div>
      </section>

      <section className="warning-panel danger-panel">
        <div className="warning-icon">
          <AlertTriangle />
        </div>

        <div>
          <h2>7. Limitation of liability</h2>
          <p>
            JoblyHub shall not be held responsible for losses resulting from
            fraudulent job offers, actions taken by third-party employers, or
            misuse of personal information shared with external parties. Users
            agree to use the platform at their own discretion and risk.
          </p>
        </div>
      </section>

      <section className="cta-band">
        <div>
          <h2>8. Final advisory</h2>
          <p>
            A legitimate employer will never require payment from you to offer a
            job. Your awareness and caution are essential in protecting yourself.
          </p>
        </div>

        <Link to="/contact" className="btn btn-primary">
          Report Concern
        </Link>
      </section>
    </InfoPage>
  );
}