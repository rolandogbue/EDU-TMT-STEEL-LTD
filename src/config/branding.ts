import defaultLogo from "@/assets/Logo(Edu).PNG";

/**
 * Brand configuration.
 * To use a custom logo:
 *   1. Drop your file into `src/assets/` (e.g. `src/assets/my-logo.png`)
 *   2. Import it below and assign to `logoSrc`, or set `logoSrc` to null
 *      to fall back to the text-only "EDU / TMT Steel" mark.
 *
 * Example:
 *   import myLogo from "@/assets/my-logo.png";
 *   export const BRANDING = { logoSrc: myLogo, ... }
 */
export const BRANDING = {
  // Change these values to rebrand fallback text/alt text without editing layout.
  logoSrc: defaultLogo as string | null,
  logoAlt: "EDU TMT Steel Limited",
  brandName: "TMT",
  brandAccent: "Steel",
  shortMark: "EDU",
};
