import { Mail, MapPin, Phone, Send, Globe2 } from 'lucide-react';
import InfoPage from './InfoPage';

export default function Contact() {
  return (
    <InfoPage
      eyebrow="Contact JoblyHub"
      title="Talk to us about support, jobs, partnerships, or enquiries."
      subtitle="Reach the JoblyHub team for help with employer accounts, job listings, applications, or platform questions."
      badge="We are here to help"
    >
      <section className="contact-layout">
        <div className="contact-main">
          <div className="section-heading left">
            <span>Get in touch</span>
            <h2>Contact details</h2>
            <p>
              Use the details below to reach JoblyHub. For suspicious job
              listings, include the job title and company name when contacting
              support.
            </p>
          </div>

          <div className="contact-cards">
            <div className="contact-card">
              <Mail />
              <div>
                <span>Email</span>
                <strong>support@joblyhub.com</strong>
              </div>
            </div>

            <div className="contact-card">
              <Phone />
              <div>
                <span>Phone</span>
                <strong>0553934068</strong>
              </div>
            </div>

            <div className="contact-card">
              <Globe2 />
              <div>
                <span>Website</span>
                <strong>trendspaceventures.netlify.app</strong>
              </div>
            </div>

            <div className="contact-card">
              <MapPin />
              <div>
                <span>Location</span>
                <strong>Ghana</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-card">
          <div className="form-card-icon">
            <Send />
          </div>

          <h3>Message preview</h3>
          <p>
            A real contact form can be connected later. For now, users can reach
            JoblyHub through email or phone.
          </p>

          <div className="fake-form">
            <input placeholder="Your name" disabled />
            <input placeholder="Your email" disabled />
            <textarea placeholder="Your message" disabled></textarea>
            <button className="btn btn-primary" disabled>
              Send Message
            </button>
          </div>
        </div>
      </section>
    </InfoPage>
  );
}