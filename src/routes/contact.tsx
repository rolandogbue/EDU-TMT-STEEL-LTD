import { createFileRoute } from "@tanstack/react-router";
import { FiPhone, FiMessageCircle, FiMail, FiMapPin } from "react-icons/fi";
import { CtaSection } from "@/components/site-sections";
import { CONTACT } from "@/content/site";
import { absoluteSiteUrl } from "@/config/branding";

const GOOGLE_MAPS_EMBED_URL = [
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15763.946696750003!2d7.536012755419925!3d8.973372500000004",
  "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0f0034be2031%3A0xe6f12b5cf676826f",
  "!2sEDU%20TMT%20STEEL%20LIMITED!5e0!3m2!1sen!2sng!4v1791016819783!5m2!1sen!2sng",
].join("");

const GOOGLE_MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `EDU TMT STEEL LIMITED, ${CONTACT.address}`,
)}`;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact EDU TMT Steel Limited — Abuja | +234 803 868 5377" },
      {
        name: "description",
        content:
          "Contact EDU TMT Steel in Jikwoyi, Abuja for building materials, quotes and free estimates. Call or WhatsApp +234 803 868 5377, or visit our office.",
      },
      { property: "og:title", content: "Contact EDU TMT Steel Limited — Abuja" },
      {
        property: "og:description",
        content:
          "Call, WhatsApp or email EDU TMT Steel for a quote or free estimate, or visit us in Jikwoyi, Abuja.",
      },
      { property: "og:url", content: absoluteSiteUrl("/contact") },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/contact") }],
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
            Call, WhatsApp or email us for a quote. You can also visit us in Jikwoyi or use Google
            Maps to plan your route.
          </p>
        </div>
      </section>

      <section className="services-section contact-channels-section" aria-label="Contact channels">
        <div className="services-grid">
          <a href={CONTACT.phoneHref} className="service-card" style={{ textDecoration: "none" }}>
            <div className="service-icon-wrap" aria-hidden>
              <FiPhone size={26} />
            </div>
            <h2 className="service-name">Call Us</h2>
            <p className="service-desc">
              Call any time for a quote, help estimating quantities or an urgent order. Our support
              team is available 24/7; same-day dispatch applies to in-stock items.
            </p>
            <div className="service-detail">{CONTACT.phone}</div>
          </a>

          <a href={CONTACT.whatsapp} className="service-card" style={{ textDecoration: "none" }}>
            <div className="service-icon-wrap" aria-hidden>
              <FiMessageCircle size={26} />
            </div>
            <h2 className="service-name">WhatsApp Us</h2>
            <p className="service-desc">
              Send us your material list to ask about pricing and delivery. WhatsApp is a convenient
              way to request a quote.
            </p>
            <div className="service-detail">Chat now</div>
          </a>

          <a
            href={`mailto:${CONTACT.email}`}
            className="service-card"
            style={{ textDecoration: "none" }}
          >
            <div className="service-icon-wrap" aria-hidden>
              <FiMail size={26} />
            </div>
            <h2 className="service-name">Email Us</h2>
            <p className="service-desc">
              Email your BOQ, drawings or project brief. Our estimation team can prepare a full
              material breakdown for your review.
            </p>
            <div className="service-detail">{CONTACT.email}</div>
          </a>

          <a
            href={GOOGLE_MAPS_DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer"
            className="service-card"
            style={{ textDecoration: "none" }}
          >
            <div className="service-icon-wrap" aria-hidden>
              <FiMapPin size={26} />
            </div>
            <h2 className="service-name">Visit Us</h2>
            <p className="service-desc">
              Find us in Jikwoyi, or open Google Maps for directions from your location.
            </p>
            <div className="service-detail">Plot 349A, Jikwoyi, Abuja</div>
          </a>
        </div>
      </section>

      <section className="contact-location-section" aria-labelledby="contact-location-title">
        <div className="contact-location-panel">
          <div className="contact-location-copy">
            <div className="section-label-light">Find Us in Abuja</div>
            <h2 id="contact-location-title" className="contact-location-title">
              Visit us in <span>Jikwoyi.</span>
            </h2>
            <p className="contact-location-description">
              Visit us in Jikwoyi or use the map to plan your route. We deliver building materials
              to project sites across Abuja and the FCT.
            </p>
            <div className="contact-location-address">
              <span className="contact-location-address-label">Our address</span>
              <address>{CONTACT.address}</address>
            </div>
            <a
              href={GOOGLE_MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-large"
            >
              <FiMapPin aria-hidden="true" />
              Get directions
            </a>
          </div>
          <div className="contact-map-frame">
            <iframe
              title="Google Maps location for EDU TMT Steel Limited in Jikwoyi, Abuja"
              src={GOOGLE_MAPS_EMBED_URL}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
