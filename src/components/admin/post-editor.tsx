import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { COVER_WIDTHS, buildSrcSet, resizeCoverImage } from "@/lib/image-resize";

type Category = { id: string; name: string };
type Status = "draft" | "published" | "scheduled";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const toDateTimeLocalValue = (value: string | Date | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
};

export function PostEditor({
  postId,
  onSaved,
}: {
  postId?: string;
  onSaved?: (id: string) => void;
}) {
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [preview, setPreview] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [coverSrcset, setCoverSrcset] = useState<Record<string, string> | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  const [status, setStatus] = useState<Status>("draft");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [originalStatus, setOriginalStatus] = useState<Status>("draft");
  const [originalPublishedAt, setOriginalPublishedAt] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [authorName, setAuthorName] = useState("");
  const saveButtonLabels: Record<Status, string> = {
    draft: "Save draft",
    published: "Publish now",
    scheduled: "Schedule post",
  };
  const savingButtonLabels: Record<Status, string> = {
    draft: "Saving…",
    published: "Publishing…",
    scheduled: "Scheduling…",
  };

  useEffect(() => {
    supabase
      .from("blog_categories")
      .select("id,name")
      .order("name")
      .then(({ data }) => {
        setCategories((data ?? []) as Category[]);
      });
  }, []);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      const { data: post } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .maybeSingle();
      if (post) {
        setTitle(post.title ?? "");
        setSlug(post.slug ?? "");
        setSlugTouched(true);
        setExcerpt(post.excerpt ?? "");
        setBody(post.body ?? "");
        setCoverImage(post.cover_image ?? "");
        setCoverSrcset((post.cover_image_srcset as Record<string, string> | null) ?? null);

        const loadedStatus = (post.status as Status) ?? "draft";
        setStatus(loadedStatus);
        setOriginalStatus(loadedStatus);
        setOriginalPublishedAt(post.published_at ?? null);
        setPublishedAt(toDateTimeLocalValue(post.published_at));
        setSeoTitle(post.seo_title ?? "");
        setSeoDescription(post.seo_description ?? "");
        setCategoryId(post.category_id ?? "");
        setAuthorName(post.author_name ?? "");
      }
      const { data: pt } = await supabase
        .from("blog_post_tags")
        .select("blog_tags(name)")
        .eq("post_id", postId);
      const names = ((pt ?? []) as Array<{ blog_tags: { name: string } | null }>)
        .map((t) => t.blog_tags?.name)
        .filter(Boolean) as string[];
      setTags(names.join(", "));
      setLoading(false);
    })();
  }, [postId]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const uploadCover = useCallback(async (file: File) => {
    setError(null);
    setCoverUploading(true);
    try {
      const variants = await resizeCoverImage(file);
      const folder = `blog/${crypto.randomUUID()}`;
      const uploadedSrcset: Record<string, string> = {};
      let largestUrl = "";
      for (const v of variants) {
        const path = `${folder}/${v.width}.jpg`;
        const { error: upErr } = await supabase.storage
          .from("site-assets")
          .upload(path, v.blob, { upsert: false, contentType: "image/jpeg" });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
        uploadedSrcset[String(v.width)] = data.publicUrl;
        if (v.width === COVER_WIDTHS[COVER_WIDTHS.length - 1]) largestUrl = data.publicUrl;
      }
      setCoverSrcset(uploadedSrcset);
      setCoverImage(largestUrl || uploadedSrcset[String(COVER_WIDTHS[0])]);
    } catch (e) {
      if (import.meta.env.DEV) console.error("Cover image upload failed", e);
      setError("We couldn't upload the cover image. Please try again.");
    } finally {
      setCoverUploading(false);
    }
  }, []);

  const upsertTags = async (postId: string, tagString: string) => {
    const names = tagString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!names.length) {
      await supabase.from("blog_post_tags").delete().eq("post_id", postId);
      return;
    }
    // Upsert tags
    const tagRows = names.map((n) => ({ name: n, slug: slugify(n) }));
    await supabase
      .from("blog_tags")
      .upsert(tagRows, { onConflict: "slug", ignoreDuplicates: true });
    const { data: existing } = await supabase
      .from("blog_tags")
      .select("id,slug")
      .in("slug", names.map(slugify));
    const ids = (existing ?? []).map((t) => t.id);
    await supabase.from("blog_post_tags").delete().eq("post_id", postId);
    if (ids.length) {
      await supabase
        .from("blog_post_tags")
        .insert(ids.map((tag_id) => ({ post_id: postId, tag_id })));
    }
  };

  const save = async () => {
    setError(null);
    setMsg(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    const finalSlug = slug.trim() || slugify(title);
    if (!finalSlug) {
      setError("A URL slug is required");
      return;
    }
    const scheduledDate = status === "scheduled" && publishedAt ? new Date(publishedAt) : null;
    const hasValidSchedule =
      !!scheduledDate &&
      !Number.isNaN(scheduledDate.getTime()) &&
      scheduledDate.getTime() > Date.now();
    if (status === "scheduled" && !hasValidSchedule) {
      setError("Choose a publish date and time in the future.");
      return;
    }
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const payload = {
        title: title.trim().slice(0, 200),
        slug: finalSlug,
        excerpt: excerpt.trim().slice(0, 400) || null,
        body,
        cover_image: coverImage || null,
        cover_image_srcset: coverSrcset,

        status,
        published_at:
          status === "draft"
            ? null
            : status === "scheduled"
              ? (scheduledDate?.toISOString() ?? null)
              : originalStatus === "published" &&
                  originalPublishedAt &&
                  new Date(originalPublishedAt).getTime() <= Date.now()
                ? originalPublishedAt
                : new Date().toISOString(),
        seo_title: seoTitle.trim().slice(0, 70) || null,
        seo_description: seoDescription.trim().slice(0, 160) || null,
        category_id: categoryId || null,
        author_id: userData.user?.id ?? null,
        author_name: authorName.trim().slice(0, 80) || userData.user?.email || null,
      };
      let id = postId;
      if (id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("blog_posts")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        id = data.id;
      }
      if (id) await upsertTags(id, tags);
      setOriginalStatus(status);
      setOriginalPublishedAt(payload.published_at);
      setMsg(
        status === "draft"
          ? "Draft saved."
          : status === "scheduled"
            ? "Post scheduled."
            : "Post published.",
      );
      if (!postId && id && onSaved) onSaved(id);
    } catch (e) {
      if (import.meta.env.DEV) console.error("Blog post save failed", e);
      setError(
        "We couldn't save your post. Please try again. If the problem continues, contact support.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page">Loading post…</div>;

  return (
    <div className="admin-page editor">
      <div className="admin-page-head">
        <h1 className="admin-h1">{postId ? "Edit post" : "New post"}</h1>
        <div className="editor-actions">
          <button className="btn-outline" onClick={() => setPreview((p) => !p)}>
            {preview ? "Hide preview" : "Preview"}
          </button>
          <button className="btn-large" onClick={save} disabled={saving}>
            {saving ? savingButtonLabels[status] : saveButtonLabels[status]}
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert error" role="alert">
          {error}
        </div>
      )}
      {msg && <div className="admin-alert ok">{msg}</div>}

      <div className="editor-grid">
        <div className="editor-main">
          <label className="admin-field">
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
          </label>
          <label className="admin-field">
            <span>URL slug</span>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              maxLength={80}
              placeholder="my-post-slug"
            />
          </label>
          <label className="admin-field">
            <span>Excerpt (shown on the blog index)</span>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={400}
            />
          </label>
          <label className="admin-field">
            <span>Body (Markdown supported)</span>
            <textarea
              rows={18}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="editor-body"
            />
          </label>

          {preview && (
            <div className="editor-preview">
              <h3>Preview</h3>
              <div className="post-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <aside className="editor-sidebar">
          <div className="admin-panel">
            <h3>Publish</h3>
            <label className="admin-field">
              <span>Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </label>
            {status === "scheduled" && (
              <label className="admin-field">
                <span>Publish at</span>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  required
                  onChange={(e) => setPublishedAt(e.target.value)}
                />
              </label>
            )}
            <p className="admin-hint">
              {status === "draft"
                ? "Drafts stay private until you publish or schedule them."
                : status === "scheduled"
                  ? "This post will publish automatically at the selected time, usually within a minute."
                  : "This post will appear on the blog as soon as you publish it."}
            </p>
          </div>

          <div className="admin-panel">
            <h3>Cover image</h3>
            {coverImage && (
              <img
                src={coverImage}
                srcSet={buildSrcSet(coverSrcset)}
                sizes="(max-width: 720px) 100vw, 320px"
                alt=""
                className="editor-cover-preview"
              />
            )}
            <p className="admin-hint">
              We auto-generate {COVER_WIDTHS.length} sizes ({COVER_WIDTHS.join(", ")}px) for fast,
              responsive loading.
            </p>
            <input
              type="file"
              accept="image/*"
              disabled={coverUploading}
              onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
            />
            {coverUploading && <p className="admin-hint">Resizing and uploading variants…</p>}
            {coverImage && (
              <button
                type="button"
                className="admin-link danger"
                onClick={() => {
                  setCoverImage("");
                  setCoverSrcset(null);
                }}
              >
                Remove image
              </button>
            )}
          </div>

          <div className="admin-panel">
            <h3>Taxonomy</h3>
            <label className="admin-field">
              <span>Category</span>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Tags (comma-separated)</span>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="steel, construction, abuja"
              />
            </label>
            <label className="admin-field">
              <span>Author name (optional)</span>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={80}
              />
            </label>
          </div>

          <div className="admin-panel">
            <h3>SEO</h3>
            <label className="admin-field">
              <span>SEO title (≤ 70 chars)</span>
              <input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                maxLength={70}
              />
            </label>
            <label className="admin-field">
              <span>SEO description (≤ 160 chars)</span>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={160}
              />
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}
