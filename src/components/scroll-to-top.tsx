import { useEffect, useRef, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Avoid showing a floating control until the visitor has moved down the page.
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    // Honor OS motion preferences, then return keyboard focus to the page content.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    // Move keyboard focus to the top of the page for a smooth SR/keyboard experience
    const target =
      (document.querySelector("main") as HTMLElement | null) ??
      (document.querySelector("h1") as HTMLElement | null);
    if (target) {
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
    btnRef.current?.blur();
  };

  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="Scroll back to top of page"
      title="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={handleClick}
      className={`scroll-top-btn${visible ? " visible" : ""}`}
    >
      <FiArrowUp size={20} strokeWidth={2.5} aria-hidden="true" focusable="false" />
      <span className="sr-only">Back to top</span>
    </button>
  );
}
