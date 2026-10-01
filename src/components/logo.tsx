import { Link } from "@tanstack/react-router";
import { BRANDING } from "@/config/branding";
import { useSiteSettings } from "@/lib/site-settings";

export function Logo({ onClick, style }: { onClick?: () => void; style?: React.CSSProperties }) {
  const { settings } = useSiteSettings();
  const logoSrc = settings.logo_url ?? BRANDING.logoSrc;

  return (
    <Link to="/" className="nav-logo" onClick={onClick} style={style}>
      {logoSrc ? (
        <img src={logoSrc} alt={BRANDING.logoAlt} className="nav-logo-img" width={44} height={44} />
      ) : (
        <>
          <div className="nav-logo-icon">{BRANDING.shortMark}</div>
          <div className="nav-logo-text">
            {BRANDING.brandName} <span>{BRANDING.brandAccent}</span>
          </div>
        </>
      )}
    </Link>
  );
}
