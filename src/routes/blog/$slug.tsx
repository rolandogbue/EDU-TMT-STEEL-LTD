import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { buildSrcSet } from "@/lib/image-resize";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  cover_image_srcset: Record<string, string> | null;
  published_at: string;
  author_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("blog_posts")
      .select(
        "id,title,slug,excerpt,body,cover_image,cover_image_srcset,published_at,author_name,seo_title,seo_description",
      )
      .eq("slug", params.slug)
      .eq("status", "published")

      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (!data) throw notFound();
    return data as Post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const title = loaderData.seo_title || `${loaderData.title} | EDU TMT Steel`;
    const desc =
      loaderData.seo_description ||
      loaderData.excerpt ||
      "Read this post on the EDU TMT Steel blog.";
    return {
      meta: [
        { title },
        { name: "description", content: desc.slice(0, 160) },
        { property: "og:title", content: title },
        { property: "og:description", content: desc.slice(0, 160) },
        { property: "og:type", content: "article" },
        ...(loaderData.cover_image
          ? [{ property: "og:image", content: loaderData.cover_image }]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/blog/${loaderData.slug}` }],
    };
  },
  notFoundComponent: () => (
    <section className="page-hero" style={{ minHeight: "80vh" }}>
      <div className="page-hero-inner" style={{ textAlign: "center" }}>
        <h1 className="page-hero-title">
          Post <em>Not Found</em>
        </h1>
        <p className="page-hero-sub">This post may have been unpublished or moved.</p>
        <Link to="/blog" className="btn-large">
          Back to blog
        </Link>
      </div>
    </section>
  ),
  errorComponent: ({ error }) => {
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";

    return (
      <section className="page-hero" style={{ minHeight: "60vh" }}>
        <div className="page-hero-inner">
          <p>Couldn't load this post: {message}</p>
        </div>
      </section>
    );
  },
  component: BlogPost,
});

function BlogPost() {
  const post = Route.useLoaderData();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("blog_post_tags")
      .select("blog_tags(name)")
      .eq("post_id", post.id)
      .then(({ data }) => {
        const names = ((data ?? []) as Array<{ blog_tags: { name: string } | null }>)
          .map((t) => t.blog_tags?.name)
          .filter(Boolean) as string[];
        setTags(names);
      });
  }, [post.id]);

  return (
    <article className="post-article">
      <header className="post-header">
        <div className="post-header-inner">
          <Link to="/blog" className="post-back">
            ← All posts
          </Link>
          <time className="post-date">
            {new Date(post.published_at).toLocaleDateString("en-NG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="post-title">{post.title}</h1>
          {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          {post.author_name && <div className="post-author">By {post.author_name}</div>}
        </div>
      </header>

      {post.cover_image && (
        <div className="post-cover">
          <img
            src={post.cover_image}
            srcSet={buildSrcSet(post.cover_image_srcset)}
            sizes="(max-width: 1024px) 100vw, 1024px"
            alt=""
            decoding="async"
          />
        </div>
      )}

      <div className="post-body-wrap">
        <div className="post-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
        {tags.length > 0 && (
          <div className="post-tags">
            {tags.map((t) => (
              <span key={t} className="post-tag">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
