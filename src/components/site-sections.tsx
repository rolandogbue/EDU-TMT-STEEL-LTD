import { PRODUCTS, SERVICES, AUDIENCES, WHY_POINTS, CONTACT, TRUST_POINTS } from "@/content/site";
import { Reveal } from "@/components/reveal";
import { FiPhone, FiMessageCircle } from "react-icons/fi";

export function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="trust-bar-label">Why Abuja Builds With Us</div>
      <div className="trust-items">
        {TRUST_POINTS.map((t, i) => {
          const Icon = t.icon;
          return (
            <Reveal key={t.title} className="trust-item" delay={i * 60}>
              <div className="trust-icon" aria-hidden>
                <Icon size={22} />
              </div>
              <div className="trust-text">
                <strong>{t.title}</strong>
                {t.body}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

export function ProductsGrid() {
  return (
    <div className="products-grid">
      {PRODUCTS.map((p, i) => {
        const Icon = p.icon;
        return (
          <Reveal
            key={p.name}
            as="article"
            delay={(i % 3) * 80}
            className={`product-card${p.featured ? " featured" : ""}`}
          >
            <div className="product-media">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                decoding="async"
                width={800}
                height={600}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="product-photo"
              />
              <span className="product-icon-badge" aria-hidden>
                <Icon size={20} />
              </span>
            </div>
            <div className="product-body">
              <h3 className="product-name">{p.name}</h3>
              <div className="product-tag">{p.tag}</div>
              <p className="product-desc">{p.desc}</p>
              <div className="product-num" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

export function ServicesGrid() {
  return (
    <div className="services-grid">
      {SERVICES.map((s, i) => {
        const Icon = s.icon;
        return (
          <Reveal key={s.name} as="article" delay={(i % 2) * 80} className="service-card">
            <div className="service-icon-wrap" aria-hidden>
              <Icon size={28} />
            </div>
            <h3 className="service-name">{s.name}</h3>
            <p className="service-desc">{s.desc}</p>
            <div className="service-detail">{s.detail}</div>
            <div className="service-big-num" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

export function AudienceGrid() {
  return (
    <div className="audience-grid">
      {AUDIENCES.map((a, i) => {
        const Icon = a.icon;
        return (
          <Reveal key={a.title} as="article" delay={(i % 2) * 80} className="audience-card">
            <span className="audience-emoji" aria-hidden>
              <Icon size={30} />
            </span>
            <h3 className="audience-title">{a.title}</h3>
            <p className="audience-pain">{a.pain}</p>
            <div className="audience-divider" />
            <p className="audience-msg">{a.msg}</p>
          </Reveal>
        );
      })}
    </div>
  );
}

export function WhySection() {
  return (
    <section className="why-section" aria-labelledby="why-title">
      <div className="why-inner">
        <div className="why-grid">
          <div className="why-content">
            <div className="section-label-light">Why Choose EDU TMT</div>
            <h2 id="why-title" className="section-title-light" style={{ marginTop: 16 }}>
              The Reliable
              <br />
              Choice in
              <br />
              <em>Abuja.</em>
            </h2>
            <div className="why-points">
              {WHY_POINTS.map((p, i) => (
                <Reveal key={p.title} className="why-point" delay={i * 80}>
                  <div className="why-point-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="why-point-content">
                    <h4>{p.title}</h4>
                    <p>{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal as="aside" className="why-visual" delay={120}>
            <div className="why-visual-main">
              <div className="why-visual-big">4.3%</div>
              <div className="why-visual-label">Nigeria's Construction Growth Rate 2025</div>
              <div className="why-visual-note">
                Abuja leads Nigeria in government and institutional construction demand. EDU TMT is
                positioned at the centre of this growth.
              </div>
            </div>
            <div className="why-supply">
              <div className="why-supply-label">We supply for</div>
              <div className="why-pills">
                <div className="why-pill">Contractors</div>
                <div className="why-pill">Developers</div>
                <div className="why-pill">Self-Builders</div>
                <div className="why-pill">Architects</div>
                <div className="why-pill">Quantity Surveyors</div>
                <div className="why-pill">Estate Builders</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ProofSection() {
  return (
    <section className="proof-section" aria-label="Our standard">
      <div className="proof-inner">
        <div className="proof-quote-mark" aria-hidden>
          &ldquo;
        </div>
        <p className="proof-text">
          In a market where material costs are volatile and project delays are expensive,
          reliability is not a feature — it's the product. EDU TMT delivers both.
        </p>
        <div className="proof-divider" />
        <div className="proof-attribution">The Standard We Hold Ourselves To</div>
        <div className="proof-stats-row">
          <div className="proof-stat-item">
            <div className="proof-stat-num">100%</div>
            <div className="proof-stat-label">Quality Guaranteed</div>
          </div>
          <div className="proof-stat-item">
            <div className="proof-stat-num">24/7</div>
            <div className="proof-stat-label">Always Reachable</div>
          </div>
          <div className="proof-stat-item">
            <div className="proof-stat-num">Same-Day</div>
            <div className="proof-stat-label">Fast Delivery Dispatch</div>
          </div>
          <div className="proof-stat-item">
            <div className="proof-stat-num">6+</div>
            <div className="proof-stat-label">Material Categories</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section id="contact" className="cta-section" aria-labelledby="cta-title">
      <div className="cta-inner">
        <div className="section-label-light">Ready to Build?</div>
        <h2 id="cta-title" className="cta-headline">
          Let's Start
          <br />
          <span>Your Project.</span>
        </h2>
        <p className="cta-sub">Call us. WhatsApp us. Walk in. We're ready when you are.</p>
        <div className="cta-buttons">
          <a href={CONTACT.phoneHref} className="btn-large">
            <FiPhone size={18} style={{ marginRight: 10, verticalAlign: "-3px" }} />
            Call for a Quote
          </a>
          <a href={CONTACT.whatsapp} className="btn-outline">
            <FiMessageCircle size={18} style={{ marginRight: 10, verticalAlign: "-3px" }} />
            WhatsApp Us
          </a>
        </div>
        <div className="cta-contacts">
          <div className="cta-contact-item">
            <span className="c-label">Phone</span>
            <span className="c-value">
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </span>
          </div>
          <div className="cta-contact-item">
            <span className="c-label">Email</span>
            <span className="c-value">
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </span>
          </div>
          <div className="cta-contact-item">
            <span className="c-label">Location</span>
            <span className="c-value">{CONTACT.location}</span>
          </div>
          <div className="cta-contact-item">
            <span className="c-label">Support</span>
            <span className="c-value">Available 24 / 7</span>
          </div>
        </div>
      </div>
    </section>
  );
}
