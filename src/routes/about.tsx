import { createFileRoute } from "@tanstack/react-router";
import { AudienceGrid, WhySection, ProofSection, CtaSection } from "@/components/site-sections";
import { absoluteSiteUrl } from "@/config/branding";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EDU TMT Steel Limited | Abuja Building Materials Supplier" },
      {
        name: "description",
        content:
          "Learn about EDU TMT Steel Limited, a building materials supplier in Abuja serving contractors, developers, architects and self-builders across the FCT.",
      },
      { property: "og:title", content: "About EDU TMT Steel Limited | Abuja" },
      {
        property: "og:description",
        content: "Building materials and project support for contractors and builders across Abuja.",
      },
      { property: "og:url", content: absoluteSiteUrl("/about") },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/about") }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="about-hero">
        <div className="page-hero-inner">
          <div className="section-label-light">Who We Are</div>
          <h1 id="about-hero" className="page-hero-title">
            More Than a Supplier. <em>A Project Partner.</em>
          </h1>
          <p className="page-hero-sub">
            Based in Jikwoyi, we supply building materials across Abuja and help contractors,
            developers, architects and homebuilders plan orders and arrange delivery.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--cream)" }}>
        <div className="about-section">
          <div className="about-left">
            <div className="about-label">What We Do</div>
            <h2 className="about-title">
              Materials and support
              <em>for projects across the FCT.</em>
            </h2>
            <p className="about-body">
              <strong>EDU TMT Steel Limited</strong> supplies TMT rods, BRC mesh, cement, roofing
              sheets, marine board and binding wire to projects across Abuja and the FCT. We work
              with contractors, developers, architects and homebuilders at different stages of a
              build.
            </p>
            <p className="about-body">
              We help customers plan quantities with free estimates, arrange delivery and inspect
              materials on site. Our team is available 24/7, and in-stock items can be dispatched
              the same day.
            </p>
            <p className="about-body">
              We are based in Jikwoyi. Call, email or visit us with your material list to discuss
              what your project needs.
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
                Each order includes help estimating quantities, delivery, on-site inspection and
                access to our support team 24/7.
              </div>
            </div>
            <div className="about-badge" aria-hidden>
              <div className="about-badge-num">FCT</div>
              <div className="about-badge-text">Abuja Based</div>
            </div>
          </div>
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
