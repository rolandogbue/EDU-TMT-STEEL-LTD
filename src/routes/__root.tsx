import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SiteSettingsProvider } from "@/lib/site-settings";
import { AuthProvider } from "@/lib/auth-hooks";
import { Analytics } from "@vercel/analytics/react";
import { absoluteSiteUrl } from "@/config/branding";

function NotFoundComponent() {
  return (
    <>
      <SiteHeader />
      <main className="page-hero" style={{ minHeight: "100vh" }}>
        <div className="page-hero-inner" style={{ textAlign: "center" }}>
          <div className="section-label-light" style={{ justifyContent: "center" }}>
            404
          </div>
          <h1 className="page-hero-title">
            Page <em>Not Found</em>
          </h1>
          <p className="page-hero-sub" style={{ margin: "0 auto 32px" }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-large">
            Return Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  return (
    <>
      <SiteHeader />
      <main className="page-hero" style={{ minHeight: "100vh" }}>
        <div className="page-hero-inner" style={{ textAlign: "center" }}>
          <div className="section-label-light" style={{ justifyContent: "center" }}>
            Error
          </div>
          <h1 className="page-hero-title">
            Something <em>Went Wrong</em>
          </h1>
          <p className="page-hero-sub" style={{ margin: "0 auto 32px" }}>
            We hit a snag loading this page. Try again or head home.
          </p>
          <div className="cta-buttons">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="btn-large"
            >
              Try Again
            </button>
            <Link to="/" className="btn-outline">
              Go Home
            </Link>
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
      { title: "EDU TMT Steel Limited | Building Materials Supplier in Abuja" },
      {
        name: "description",
        content:
          "EDU TMT Steel supplies TMT rods, BRC mesh, cement, roofing sheets and more across Abuja. Request a free estimate, arrange delivery and reach our team 24/7.",
      },
      { name: "author", content: "EDU TMT Steel Limited" },
      {
        name: "keywords",
        content:
          "TMT rods Abuja, building materials Nigeria, BRC wire mesh, cement supplier Abuja, steel rods FCT, construction materials Abuja",
      },
      { property: "og:title", content: "EDU TMT Steel Limited | Built to Build Abuja" },
      {
        property: "og:description",
        content:
          "Building materials, free estimates and project support across Abuja and the FCT.",
      },
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
          "@id": absoluteSiteUrl("/#business"),
          name: "EDU TMT Steel Limited",
          description:
            "Building materials supplier in Abuja: TMT rods, BRC wire mesh, cement, zinc roofing sheets, marine board and binding wire. Delivery, free material estimates, site inspections and 24/7 support.",
          url: absoluteSiteUrl("/"),
          address: {
            "@type": "PostalAddress",
            streetAddress: "Plot 349A, Jikwoyi Residential Layout, Along Nyanya-Karshi Road",
            addressLocality: "Abuja",
            addressRegion: "FCT",
            postalCode: "900108",
            addressCountry: "NG",
          },
          telephone: "+2348038685377",
          email: "contact@edutmtsteel.com",
          areaServed: "Abuja, Federal Capital Territory, Nigeria",
          sameAs: [
            "https://www.facebook.com/profile.php?id=61590508742462",
            "https://instagram.com/edu_tmt_steel_ltd",
          ],
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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-KQPVL3RM');
      `,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '4670541849935612');
        fbq('track', 'PageView');
        `,
          }}
        />
        {/* End Meta Pixel Code */}
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KQPVL3RM"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=4670541849935612&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
        <Analytics />
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
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
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
