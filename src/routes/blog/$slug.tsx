import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { buildSrcSet } from "@/lib/image-resize";
import { absoluteSiteUrl } from "@/config/branding";
import {
  BLOG_AUTHOR_ORGANIZATION,
  getBlogDisplayAuthorName,
  getBlogSeoDescription,
  getBlogSeoTitle,
  getPersonAuthorName,
} from "@/lib/blog-seo";

function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  cover_image_alt: string | null;
  cover_image_srcset: Record<string, string> | null;
  published_at: string;
  updated_at: string;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[];
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,body,cover_image,cover_image_alt,cover_image_srcset,published_at,updated_at,author_name,seo_title,seo_description",
      )
      .eq("slug", params.slug)
      .eq("status", "published")

      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    let postData = data;
    if (error?.code === "42703" && error.message.includes("cover_image_alt")) {
      const fallback = await supabase
        .from("blog_posts")
        .select(
          "id,title,slug,excerpt,body,cover_image,cover_image_srcset,published_at,updated_at,author_name,seo_title,seo_description",
        )
        .eq("slug", params.slug)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .maybeSingle();
      if (fallback.error) throw fallback.error;
      postData = fallback.data ? { ...fallback.data, cover_image_alt: null } : null;
    } else if (error) {
      throw error;
    }
    if (!postData) throw notFound();

    const { data: tagRows, error: tagsError } = await supabase
      .from("blog_post_tags")
      .select("blog_tags(name)")
      .eq("post_id", postData.id);
    if (tagsError) throw tagsError;
    const tags = ((tagRows ?? []) as Array<{ blog_tags: { name: string } | null }>)
      .map((tag) => tag.blog_tags?.name)
      .filter(Boolean) as string[];
    return { ...(postData as Omit<Post, "tags">), tags };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const title = getBlogSeoTitle(loaderData.title, loaderData.seo_title);
    const desc = getBlogSeoDescription(
      loaderData.seo_description,
      loaderData.excerpt,
      loaderData.body,
    );
    const articleUrl = absoluteSiteUrl("/blog/" + encodeURIComponent(loaderData.slug));
    const personAuthorName = getPersonAuthorName(loaderData.author_name);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: articleUrl },
        ...(loaderData.cover_image
          ? [{ property: "og:image", content: absoluteSiteUrl(loaderData.cover_image) }]
          : []),
        {
          name: "twitter:card",
          content: loaderData.cover_image ? "summary_large_image" : "summary",
        },
      ],
      links: [{ rel: "canonical", href: articleUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: stringifyJsonLd({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": articleUrl + "#article",
            mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
            url: articleUrl,
            headline: loaderData.title,
            description: desc,
            datePublished: loaderData.published_at,
            dateModified: loaderData.updated_at,
            author: {
              "@type": personAuthorName ? "Person" : "Organization",
              name: personAuthorName || BLOG_AUTHOR_ORGANIZATION,
            },
            publisher: {
              "@type": "Organization",
              name: BLOG_AUTHOR_ORGANIZATION,
              url: absoluteSiteUrl("/"),
            },
            ...(loaderData.cover_image
              ? { image: absoluteSiteUrl(loaderData.cover_image) }
              : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: stringifyJsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: absoluteSiteUrl("/"),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: absoluteSiteUrl("/blog"),
              },
              { "@type": "ListItem", position: 3, name: loaderData.title, item: articleUrl },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <section className="page-hero" style={{ minHeight: "80vh" }}>
      <div className="page-hero-inner" style={{ textAlign: "center" }}>
        <h1 className="page-hero-title">
          Post <em>Not Found</em>
        </h1>
        <p className="page-hero-sub">This post may have been unpublished or the link may have changed.</p>
        <Link to="/blog" className="btn-large">
          Browse all posts
        </Link>
      </div>
    </section>
  ),
  errorComponent: ({ error }) => {
    if (import.meta.env.DEV) console.error("Blog post could not be loaded", error);
    return (
      <section className="page-hero" style={{ minHeight: "60vh" }}>
        <div className="page-hero-inner">
          <p>
            We couldn't load this post right now. Please try again later or browse other articles.
          </p>
          <Link to="/blog" className="btn-large">
            Browse all posts
          </Link>
        </div>
      </section>
    );
  },
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();

  return (
    <article className="post-article">
      <header className="post-header">
        <div className="post-header-inner">
          <Link to="/blog" className="post-back">
            ← All articles
          </Link>
          <time className="post-date" dateTime={post.published_at}>
            {new Date(post.published_at).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {new Date(post.updated_at).getTime() > new Date(post.published_at).getTime() && (
            <time className="post-updated" dateTime={post.updated_at}>
              Updated{" "}
              {new Date(post.updated_at).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <h1 className="post-title">{post.title}</h1>
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          <div className="post-author">
            By {getBlogDisplayAuthorName(post.author_name)}
          </div>
        </div>
      </header>

      {post.cover_image && (
        <div className="post-cover">
          <img
            src={post.cover_image}
            srcSet={buildSrcSet(post.cover_image_srcset)}
            sizes="(max-width: 1024px) 100vw, 1024px"
            alt={post.cover_image_alt === null ? post.title : post.cover_image_alt}
            decoding="async"
          />
        </div>
      )}

      <div className="post-body-wrap">
        <div className="post-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((t) => (
              <span key={t} className="post-tag">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
      <section className="post-cta" aria-labelledby="post-cta-title">
        <div>
          <h2 id="post-cta-title">Planning a project in Abuja?</h2>
          <p>Send us your material list and delivery area to request a quote.</p>
        </div>
        <Link to="/contact" className="btn-large">
          Request a quote
        </Link>
      </section>
    </article>
  );
}
