import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrustBar,
  ProductsGrid,
  ServicesGrid,
  AudienceGrid,
  WhySection,
  ProofSection,
  CtaSection,
} from "@/components/site-sections";
import { CONTACT } from "@/content/site";
import { absoluteSiteUrl } from "@/config/branding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EDU TMT Steel Limited | Building Materials Supplier in Abuja" },
      {
        name: "description",
        content:
          "EDU TMT Steel supplies TMT rods, BRC mesh, cement, roofing sheets and more across Abuja. Request a free estimate, arrange delivery and reach our team 24/7.",
      },
      { property: "og:title", content: "EDU TMT Steel Limited | Built to Build Abuja" },
      {
        property: "og:description",
        content: "Building materials, free estimates and project support across Abuja.",
      },
      { property: "og:url", content: absoluteSiteUrl("/") },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/") }],
  }),
  component: Index,
});

const TICKER_ITEMS = [
  "TMT Rods",
  "BRC Wire Mesh",
  "Cement",
  "Zinc Roofing Sheets",
  "Marine Board",
  "Binding Wire",
  "Fast Delivery Across Abuja",
  "Same-Day Dispatch",
  "Expert Estimation",
];

function Index() {
  const ticker = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <>
      <section className="hero" aria-labelledby="hero-headline">
        <div className="hero-grid" aria-hidden />
        <div className="hero-slash" aria-hidden />
        <div className="hero-orb" aria-hidden />

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              <span className="hero-eyebrow-text">Abuja's Building Materials Partner</span>
            </div>
            <h1 id="hero-headline" className="hero-headline">
              <span className="line-stroke">Built</span>
              <span className="line-orange">to Build</span>
              <span>Abuja.</span>
            </h1>
            <p className="hero-subhead">
              We supply TMT rods, cement, roofing sheets and more to projects across Abuja. Request
              a free material estimate, arrange delivery and reach our team 24/7 for support.
            </p>
            <div className="hero-actions">
              <a href={CONTACT.phoneHref} className="btn-primary">
                Get a Quote →
              </a>
              <Link to="/services" className="btn-secondary">
                <div className="btn-arrow">↓</div>
                See Our Services
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">6+</div>
                <div className="hero-stat-label">Product Categories</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">24/7</div>
                <div className="hero-stat-label">Customer Support</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">Same-Day</div>
                <div className="hero-stat-label">Dispatch on In-Stock Items</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">100%</div>
                <div className="hero-stat-label">Quality Guaranteed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-ticker" aria-hidden>
          <div className="ticker-track">
            {ticker.map((t, i) => (
              <div key={i} className="ticker-item">
                {t}
                <div className="ticker-dot" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBar />

      <section id="about" style={{ background: "var(--cream)" }} aria-labelledby="about-title">
        <div className="about-section">
          <div className="about-left">
            <div className="about-label">Who We Are</div>
            <h2 id="about-title" className="about-title">
              More Than
              <em>a Materials Supplier.</em>A Project Partner.
            </h2>
            <p className="about-body">
              A site can lose time when materials arrive late or quantities fall short. EDU TMT
              helps you plan the order, source the materials and arrange delivery to your site.
            </p>
            <p className="about-body">
              <strong>EDU TMT Steel Limited</strong> supplies building materials across Abuja and
              the FCT, and offers free estimates, site inspections, fast delivery and 24/7 support.
              We work with you to ensure your project is completed on time and within budget.
            </p>
            <div className="about-signature">
              <div className="about-sig-line" />
              <div className="about-sig-text">
                Serving contractors, developers &amp; homebuilders across the FCT
              </div>
            </div>
          </div>

          <div className="about-right">
            <div className="about-quote-block">
              <div className="about-quote-accent" />
              <div className="about-quote-text">
                "We don't just supply your project. We show up for it."
              </div>
              <div className="about-quote-note">
                From a free material estimate to delivery and on-site inspection, our team helps you
                plan the order and get supplies to your project.
              </div>
            </div>
            <div className="about-badge" aria-hidden>
              <div className="about-badge-num">FCT</div>
              <div className="about-badge-text">Abuja Based</div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="products-section" aria-labelledby="products-title">
        <div className="products-inner">
          <div className="section-header">
            <div className="section-header-left">
              <div className="section-label-light">Our Products</div>
              <h2 id="products-title" className="section-title-light">
                Premium Materials
                <br />
                for <em>Every</em> Build
              </h2>
            </div>
            <div className="section-header-right">
              We source each product to standard and back it with our replacement guarantee. Browse
              TMT rods, BRC wire mesh, cement, roofing sheets, marine board and binding wire.
            </div>
          </div>
          <ProductsGrid />
        </div>
      </section>

      <section
        id="services"
        style={{ background: "var(--cream)" }}
        aria-labelledby="services-title"
      >
        <div className="services-section">
          <div className="services-intro">
            <div>
              <div className="about-label">Complete Project Support</div>
              <h2 id="services-title" className="services-title">
                We Don't Just <span className="line2">Supply.</span> We Show Up.
              </h2>
            </div>
            <div className="services-desc">
              Request a free material estimate, arrange delivery to your site or ask us to inspect
              your order on arrival. In-stock items can be dispatched the same day, and our team is
              available 24/7.
            </div>
          </div>
          <ServicesGrid />
        </div>
      </section>

      <WhySection />

      <section style={{ background: "var(--cream)" }} aria-labelledby="audience-title">
        <div className="audience-section">
          <div className="about-label">Who We Serve</div>
          <h2 id="audience-title" className="audience-title-main">
            Built for Every Builder
            <br />
            in <span>Abuja.</span>
          </h2>
          <AudienceGrid />
        </div>
      </section>

      <ProofSection />
      <CtaSection />
    </>
  );
}
