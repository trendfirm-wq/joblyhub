import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function InfoPage({
  eyebrow,
  title,
  subtitle,
  children,
  badge,
}) {
  return (
    <div className="site">
      <Navbar />

      <main className="info-page">
        <div className="container">
          <section className="info-hero premium-info-hero">
            <div className="info-hero-content">
              {badge && <div className="info-badge">{badge}</div>}

              <span>{eyebrow}</span>
              <h1>{title}</h1>

              {subtitle && <p>{subtitle}</p>}
            </div>

            <div className="info-hero-card">
              <div className="hero-card-dot"></div>
              <strong>JoblyHub MVP</strong>
              <p>Simple, reliable, and built to grow with employers and job seekers.</p>
            </div>
          </section>

          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}