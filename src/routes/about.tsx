import { createFileRoute } from "@tanstack/react-router";
import { AudienceGrid, WhySection, ProofSection, CtaSection } from "@/components/site-sections";

// About page: the route provides metadata; shared sections hold reusable layout.
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About EDU TMT Steel Limited — Abuja's Materials Partner" },
      { name: "description", content: "EDU TMT Steel Limited is Abuja's trusted building materials partner — helping contractors, developers, architects and self-builders keep projects moving from foundation to finish." },
      { property: "og:title", content: "About EDU TMT Steel Limited — Abuja's Materials Partner" },
      { property: "og:description", content: "More than a supplier. A project partner." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
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
            Based in Abuja. Trusted by contractors, developers and homebuilders across the FCT. Built to keep your project moving.
          </p>
        </div>
      </section>

      <section style={{ background: "var(--cream)" }}>
        <div className="about-section">
          <div className="about-left">
            <div className="about-label">Our Story</div>
            <h2 className="about-title">
              We Built EDU TMT
              <em>for builders who can't afford to wait.</em>
            </h2>
            <p className="about-body">
              At <strong>EDU TMT Steel Limited</strong>, we understand that a construction project is never just a shopping list. Delays cost money. Wrong quantities waste budgets. Unreliable suppliers derail timelines — and careers.
            </p>
            <p className="about-body">
              That's why we built a company that does more than sell. We <strong>estimate, deliver, inspect, and support</strong>, so your project keeps moving from foundation to finish. Every order comes with expert estimation, reliable delivery, on-site inspection, and round-the-clock support.
            </p>
            <p className="about-body">
              We live and operate in the same city we serve. We understand your projects, your timelines, and your pressures — because we're in the FCT with you.
            </p>
            <div className="about-signature">
              <div className="about-sig-line" />
              <div className="about-sig-text">Trusted by contractors, developers &amp; homebuilders across the FCT</div>
            </div>
          </div>

          <div className="about-right">
            <div className="about-quote-block">
              <div className="about-quote-accent" />
              <div className="about-quote-text">"We don't just supply your project. We show up for it."</div>
              <div className="about-quote-note">
                This is what it means to have a building materials partner — not just a vendor. It's the standard we hold ourselves to on every order, every delivery, every call.
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
            Built for Every Builder<br />in <span>Abuja.</span>
          </h2>
          <AudienceGrid />
        </div>
      </section>

      <ProofSection />
      <CtaSection />
    </>
  );
}
