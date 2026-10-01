import { createFileRoute } from "@tanstack/react-router";
import { ServicesGrid, CtaSection } from "@/components/site-sections";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Fast Delivery, Estimation & Site Inspection | EDU TMT Steel" },
      {
        name: "description",
        content:
          "Fast delivery across Abuja, free expert material estimation, on-site inspection, same-day dispatch, 24/7 support and a 100% quality guarantee — all built into every order.",
      },
      { property: "og:title", content: "Complete Project Support Services | EDU TMT Steel" },
      {
        property: "og:description",
        content:
          "We don't just supply. We show up. Full-service building materials support across Abuja.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="services-hero">
        <div className="page-hero-inner">
          <div className="section-label-light">Complete Project Support</div>
          <h1 id="services-hero" className="page-hero-title">
            We Don't Just Supply. <em>We Show Up.</em>
          </h1>
          <p className="page-hero-sub">
            No other building materials supplier in Abuja wraps their products in this level of
            service. From the moment you enquire to the day your materials are on-site and verified
            — we are with you.
          </p>
        </div>
      </section>

      <section className="services-section" aria-label="Services">
        <ServicesGrid />
      </section>

      <CtaSection />
    </>
  );
}
