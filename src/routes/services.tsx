import { createFileRoute } from "@tanstack/react-router";
import { ServicesGrid, CtaSection } from "@/components/site-sections";
import { absoluteSiteUrl } from "@/config/branding";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Fast Delivery, Estimation & Site Inspection | EDU TMT Steel" },
      {
        name: "description",
        content:
          "Building materials delivery in Abuja, free estimates, on-site inspection, same-day dispatch on in-stock items, 24/7 support and a 100% quality guarantee.",
      },
      { property: "og:title", content: "Complete Project Support Services | EDU TMT Steel" },
      {
        property: "og:description",
        content:
          "Free estimates, on-site inspections and building materials delivery across Abuja.",
      },
      { property: "og:url", content: absoluteSiteUrl("/services") },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/services") }],
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
            Request a free estimate, arrange delivery to your site or ask us to inspect your order
            on arrival. In-stock items can be dispatched the same day, and our team is available
            24/7.
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
