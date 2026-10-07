import { createFileRoute } from "@tanstack/react-router";
import { FiPhone, FiMessageCircle, FiMail, FiMapPin } from "react-icons/fi";
import { CtaSection } from "@/components/site-sections";
import { CONTACT } from "@/content/site";

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
          "Call, WhatsApp, or visit EDU TMT Steel Limited at Plot 349A, Jikwoyi, Abuja for quotes, free material estimation, and building materials.",
      },
      { property: "og:title", content: "Contact EDU TMT Steel Limited — Abuja" },
      {
        property: "og:description",
        content:
          "Get a quote, request a free estimate, or arrange delivery. We're ready when you are.",
      },
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
            Call. WhatsApp. Email. Walk in. Whatever works for you — we're reachable, and we're
            ready.
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
              Talk to a real person 24/7. We pick up whether you need a quote, estimation help, or
              an urgent same-day delivery.
            </p>
            <div className="service-detail">{CONTACT.phone}</div>
          </a>

          <a href={CONTACT.whatsapp} className="service-card" style={{ textDecoration: "none" }}>
            <div className="service-icon-wrap" aria-hidden>
              <FiMessageCircle size={26} />
            </div>
            <h2 className="service-name">WhatsApp Us</h2>
            <p className="service-desc">
              Share your material list, get pricing, and confirm delivery — all over WhatsApp.
              Fastest way to get a quote back.
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
              Send your BOQ, drawings, or project brief. Our estimation team will come back with a
              full material breakdown.
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
              Visit our Jikwoyi location or open Google Maps to get directions from where you are.
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
              Come by our Abuja location or get directions to plan your visit. We also deliver
              building materials across Abuja and the FCT.
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
