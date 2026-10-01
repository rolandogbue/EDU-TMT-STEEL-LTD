import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SiteSettingsProvider } from "@/lib/site-settings";
import { AuthProvider } from "@/lib/auth-hooks";

function NotFoundComponent() {
  return (
    <>
      <SiteHeader />
      <main className="page-hero" style={{ minHeight: "100vh" }}>
        <div className="page-hero-inner" style={{ textAlign: "center" }}>
          <div className="section-label-light" style={{ justifyContent: "center" }}>404</div>
          <h1 className="page-hero-title">Page <em>Not Found</em></h1>
          <p className="page-hero-sub" style={{ margin: "0 auto 32px" }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-large">Return Home</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <>
      <SiteHeader />
      <main className="page-hero" style={{ minHeight: "100vh" }}>
        <div className="page-hero-inner" style={{ textAlign: "center" }}>
          <div className="section-label-light" style={{ justifyContent: "center" }}>Error</div>
          <h1 className="page-hero-title">Something <em>Went Wrong</em></h1>
          <p className="page-hero-sub" style={{ margin: "0 auto 32px" }}>
            We hit a snag loading this page. Try again or head home.
          </p>
          <div className="cta-buttons">
            <button onClick={() => { router.invalidate(); reset(); }} className="btn-large">Try Again</button>
            <Link to="/" className="btn-outline">Go Home</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EDU TMT Steel Limited — Building Materials Supplier in Abuja" },
      {
        name: "description",
        content:
          "Abuja's trusted building materials partner. TMT rods, BRC wire mesh, cement, roofing sheets and more with fast delivery, expert estimation and 24/7 support.",
      },
      { name: "author", content: "EDU TMT Steel Limited" },
      { name: "keywords", content: "TMT rods Abuja, building materials Nigeria, BRC wire mesh, cement supplier Abuja, steel rods FCT, construction materials Abuja" },
      { property: "og:title", content: "EDU TMT Steel Limited — Built to Build Abuja" },
      { property: "og:description", content: "Premium building materials with complete project support across Abuja and the FCT." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "EDU TMT Steel Limited" },
      { property: "og:locale", content: "en_NG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#E8580B" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Barlow:wght@300;400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "EDU TMT Steel Limited",
          image: "",
          description:
            "Building materials supplier in Abuja: TMT rods, BRC wire mesh, cement, zinc roofing sheets, marine board and binding wire. Fast delivery, expert estimation and 24/7 support.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Abuja",
            addressRegion: "FCT",
            addressCountry: "NG",
          },
          telephone: "+234-803-868-5377",
          email: "contact@edutmtsteel.com",
          areaServed: "Abuja, FCT, Nigeria",
          priceRange: "₦₦",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteSettingsProvider>
        <AuthProvider>
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>
            <Outlet />
          </main>
          <SiteFooter />
          <ScrollToTop />
        </AuthProvider>
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}
