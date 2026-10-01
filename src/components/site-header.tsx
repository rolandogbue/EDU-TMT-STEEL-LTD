import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Logo } from "@/components/logo";
import { useAuth } from "@/lib/auth-hooks";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <Logo onClick={close} />
      <ul className={`nav-links${open ? "" : " mobile-hidden"}`}>
        <li>
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "active" }} onClick={close}>
            Home
          </Link>
        </li>
        <li><Link to="/products" activeProps={{ className: "active" }} onClick={close}>Products</Link></li>
        <li><Link to="/services" activeProps={{ className: "active" }} onClick={close}>Services</Link></li>
        <li><Link to="/blog" activeProps={{ className: "active" }} onClick={close}>Blog</Link></li>
        <li><Link to="/about" activeProps={{ className: "active" }} onClick={close}>About</Link></li>
        <li><Link to="/contact" activeProps={{ className: "active" }} onClick={close}>Contact</Link></li>
        {isAdmin && (
          <li><Link to="/admin" activeProps={{ className: "active" }} onClick={close}>Admin</Link></li>
        )}
        <li>
          <a href="tel:+2348038685377" className="nav-cta" onClick={close}>Get a Quote</a>
        </li>
      </ul>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>
    </nav>
  );
}
