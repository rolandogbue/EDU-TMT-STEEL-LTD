import { createFileRoute } from "@tanstack/react-router";
import { ProductsGrid, CtaSection } from "@/components/site-sections";
import { absoluteSiteUrl } from "@/config/branding";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Building Materials in Abuja | TMT Rods & More | EDU TMT Steel" },
      {
        name: "description",
        content:
          "TMT rods (6mm–32mm), BRC wire mesh, cement, zinc roofing sheets, marine board and binding wire in Abuja, all covered by our replacement guarantee.",
      },
      { property: "og:title", content: "Building Materials in Abuja | EDU TMT Steel" },
      {
        property: "og:description",
        content:
          "TMT rods, cement, BRC mesh, roofing sheets and other materials for Abuja projects.",
      },
      { property: "og:url", content: absoluteSiteUrl("/products") },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/products") }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <>
      <section className="page-hero" aria-labelledby="products-hero">
        <div className="page-hero-inner">
          <div className="section-label-light">Our Products</div>
          <h1 id="products-hero" className="page-hero-title">
            Premium Materials
            <br />
            for <em>Every</em> Build.
          </h1>
          <p className="page-hero-sub">
            Our six core product categories are always in stock. Each is sourced to standard and
            covered by our replacement guarantee. Choose TMT rods, BRC mesh, cement, roofing sheets,
            marine board or binding wire for your project.
          </p>
        </div>
      </section>

      <section className="products-section" style={{ paddingTop: 80 }} aria-label="Product catalog">
        <div className="products-inner">
          <ProductsGrid />
        </div>
      </section>

      <CtaSection />
    </>
  );
}
