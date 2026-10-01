import { createFileRoute } from "@tanstack/react-router";
import { FiPhone, FiMessageCircle, FiMail, FiMapPin } from "react-icons/fi";
import { CtaSection } from "@/components/site-sections";
import { CONTACT } from "@/content/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EDU TMT Steel Limited — Abuja | +234 803 868 5377" },
      { name: "description", content: "Call, WhatsApp, or email EDU TMT Steel Limited in Abuja for quotes, free material estimation, and same-day dispatch. Available 24/7 for urgent orders." },
      { property: "og:title", content: "Contact EDU TMT Steel Limited — Abuja" },
      { property: "og:description", content: "Get a quote, request a free estimate, or arrange delivery. We're ready when you are." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="contact-hero">
        <div className="page-hero-inner">
          <div className="section-label-light">Get in Touch</div>
          <h1 id="contact-hero" className="page-hero-title">
            Let's Start <em>Your Project.</em>
          </h1>
          <p className="page-hero-sub">
            Call. WhatsApp. Email. Walk in. Whatever works for you — we're reachable, and we're ready.
          </p>
        </div>
      </section>

      <section className="services-section" aria-label="Contact channels">
        <div className="services-grid">
          <a href={CONTACT.phoneHref} className="service-card" style={{ textDecoration: "none" }}>
            <div className="service-icon-wrap" aria-hidden><FiPhone size={26} /></div>
            <h2 className="service-name">Call Us</h2>
            <p className="service-desc">
              Talk to a real person 24/7. We pick up whether you need a quote, estimation help, or an urgent same-day delivery.
            </p>
            <div className="service-detail">{CONTACT.phone}</div>
          </a>

          <a href={CONTACT.whatsapp} className="service-card" style={{ textDecoration: "none" }}>
            <div className="service-icon-wrap" aria-hidden><FiMessageCircle size={26} /></div>
            <h2 className="service-name">WhatsApp Us</h2>
            <p className="service-desc">
              Share your material list, get pricing, and confirm delivery — all over WhatsApp. Fastest way to get a quote back.
            </p>
            <div className="service-detail">Chat now</div>
          </a>

          <a href={`mailto:${CONTACT.email}`} className="service-card" style={{ textDecoration: "none" }}>
            <div className="service-icon-wrap" aria-hidden><FiMail size={26} /></div>
            <h2 className="service-name">Email Us</h2>
            <p className="service-desc">
              Send your BOQ, drawings, or project brief. Our estimation team will come back with a full material breakdown.
            </p>
            <div className="service-detail">{CONTACT.email}</div>
          </a>

          <div className="service-card">
            <div className="service-icon-wrap" aria-hidden><FiMapPin size={26} /></div>
            <h2 className="service-name">Visit Us</h2>
            <p className="service-desc">
              Based in Abuja, FCT — proudly serving contractors, developers, architects and self-builders across the Federal Capital Territory.
            </p>
            <div className="service-detail">{CONTACT.location}</div>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
