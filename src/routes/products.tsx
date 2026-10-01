import { createFileRoute } from "@tanstack/react-router";
import { ProductsGrid, CtaSection } from "@/components/site-sections";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Building Materials & TMT Rods in Abuja | EDU TMT Steel" },
      {
        name: "description",
        content:
          "Explore our range: TMT rods (6mm–32mm), BRC wire mesh, cement, zinc roofing sheets, marine board and binding wire. Sourced to standard, backed by our quality guarantee.",
      },
      { property: "og:title", content: "Building Materials & TMT Rods in Abuja | EDU TMT Steel" },
      {
        property: "og:description",
        content:
          "Premium construction materials for contractors, developers and self-builders across Abuja.",
      },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
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
            Six core product categories, always in stock. Every item is sourced to standard and
            backed by our replacement guarantee — the same trust our TMT rods carry into your
            foundation.
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
