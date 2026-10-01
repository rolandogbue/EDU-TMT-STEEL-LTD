import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/reveal";
import { buildSrcSet } from "@/lib/image-resize";


const POSTS_PER_PAGE = 9;

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1).default(1),
});

export const Route = createFileRoute("/blog/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Blog & Insights | EDU TMT Steel — Construction in Abuja" },
      { name: "description", content: "Practical guides, project updates and construction insights from EDU TMT Steel — Abuja's trusted building materials partner." },
      { property: "og:title", content: "EDU TMT Steel Blog — Building Insights for Abuja" },
      { property: "og:description", content: "Guides and updates on TMT rods, cement, roofing and construction best practices." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  cover_image_srcset: Record<string, string> | null;
  published_at: string;
  author_name: string | null;
};


function BlogIndex() {
  const { page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const from = (page - 1) * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;
    setLoading(true);
    supabase
      .from("blog_posts")
      .select("id,title,slug,excerpt,cover_image,cover_image_srcset,published_at,author_name", { count: "exact" })
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .range(from, to)
      .then(({ data, count }) => {
        setPosts((data ?? []) as Post[]);
        setTotal(count ?? 0);
        setLoading(false);
        if (typeof window !== "undefined" && page > 1) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const pageNumbers = buildPageList(page, totalPages);

  return (
    <>
      <section className="page-hero" aria-labelledby="blog-hero">
        <div className="page-hero-inner">
          <div className="section-label-light">Blog</div>
          <h1 id="blog-hero" className="page-hero-title">
            Insights for<br />Better <em>Builds.</em>
          </h1>
          <p className="page-hero-sub">
            Guides, project updates and material knowledge from Abuja's construction frontline.
          </p>
        </div>
      </section>

      <section className="blog-list-section" aria-label="Blog posts">
        <div className="blog-list-inner">
          {loading ? (
            <p className="blog-empty">Loading posts…</p>
          ) : posts.length === 0 ? (
            <p className="blog-empty">
              {page > 1 ? (
                <>No posts on this page. <Link to="/blog" search={{ page: 1 }}>Back to page 1</Link>.</>
              ) : (
                "No posts published yet — check back soon."
              )}
            </p>
          ) : (
            <>
              <div className="blog-grid">
                {posts.map((p, i) => (
                  <Reveal key={p.id} as="article" delay={(i % 3) * 80} className="blog-card">
                    <Link to="/blog/$slug" params={{ slug: p.slug }} className="blog-card-link">
                      {p.cover_image && (
                        <div className="blog-card-media">
                          <img
                            src={p.cover_image}
                            srcSet={buildSrcSet(p.cover_image_srcset)}
                            sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 400px"
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}

                      <div className="blog-card-body">
                        <time className="blog-card-date">
                          {new Date(p.published_at).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" })}
                        </time>
                        <h2 className="blog-card-title">{p.title}</h2>
                        {p.excerpt && <p className="blog-card-excerpt">{p.excerpt}</p>}
                        {p.author_name && <div className="blog-card-author">By {p.author_name}</div>}
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="blog-pagination" aria-label="Blog pagination">
                  <button
                    className="blog-page-btn"
                    onClick={() => navigate({ search: { page: page - 1 } })}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    ← Prev
                  </button>
                  <ul className="blog-page-list">
                    {pageNumbers.map((n, idx) =>
                      n === "…" ? (
                        <li key={`gap-${idx}`} className="blog-page-gap" aria-hidden="true">…</li>
                      ) : (
                        <li key={n}>
                          <Link
                            to="/blog"
                            search={{ page: n }}
                            className={`blog-page-num${n === page ? " is-current" : ""}`}
                            aria-label={`Page ${n}`}
                            aria-current={n === page ? "page" : undefined}
                          >
                            {n}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                  <button
                    className="blog-page-btn"
                    onClick={() => navigate({ search: { page: page + 1 } })}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

/** Build a compact pager: 1 … 4 5 [6] 7 8 … 20 */
function buildPageList(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | "…"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}
