import { Link } from "@tanstack/react-router";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaXTwitter, FaWhatsapp } from "react-icons/fa6";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo style={{ textDecoration: "none", display: "inline-flex" }} />
            <div className="footer-tagline">
              Built to
              <br />
              Build Abuja.
            </div>
            <p className="footer-bio">
              Abuja's foremost building materials partner. Premium products, complete project
              support, and the reliability your construction project deserves.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook" className="social-btn">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="LinkedIn" className="social-btn">
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="Instagram" className="social-btn">
                <FaInstagram />
              </a>
              <a href="#" aria-label="X" className="social-btn">
                <FaXTwitter />
              </a>
              <a href="https://wa.me/2348038685377" aria-label="WhatsApp" className="social-btn">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Products</h5>
            <ul className="footer-links">
              <li>
                <Link to="/products">TMT Rods</Link>
              </li>
              <li>
                <Link to="/products">BRC Wire Mesh</Link>
              </li>
              <li>
                <Link to="/products">Cement</Link>
              </li>
              <li>
                <Link to="/products">Zinc Roofing Sheets</Link>
              </li>
              <li>
                <Link to="/products">Marine Board</Link>
              </li>
              <li>
                <Link to="/products">Binding Wire</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Services</h5>
            <ul className="footer-links">
              <li>
                <Link to="/services">Fast Delivery</Link>
              </li>
              <li>
                <Link to="/services">Material Estimation</Link>
              </li>
              <li>
                <Link to="/services">Site Inspection</Link>
              </li>
              <li>
                <Link to="/services">Quick Turnaround</Link>
              </li>
              <li>
                <Link to="/services">Quality Guarantee</Link>
              </li>
              <li>
                <Link to="/services">24/7 Support</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            <ul className="footer-links">
              <li>
                <a href="tel:+2348038685377">+234 803 868 5377</a>
              </li>
              <li>
                <a href="mailto:contact@edutmtsteel.com">contact@edutmtsteel.com</a>
              </li>
              <li>
                <Link to="/contact">Abuja, FCT Nigeria</Link>
              </li>
              <li>
                <Link to="/contact">Get a Free Estimate</Link>
              </li>
              <li>
                <a href="https://wa.me/2348038685377">WhatsApp Us</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © 2025 <strong>EDU TMT Steel Limited</strong>. All rights reserved.
          </div>
          <div className="footer-tagline-small">Built to Build Abuja.</div>
        </div>
      </div>
    </footer>
  );
}
