import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/blog/")({
  component: BlogList,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  updated_at: string;
};

function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("id,title,slug,status,published_at,updated_at")
      .order("updated_at", { ascending: false });
    setPosts((data ?? []) as Post[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    load();
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1 className="admin-h1">Blog posts</h1>
        <Link to="/admin/blog/new" className="btn-large">+ New post</Link>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : posts.length === 0 ? (
        <div className="admin-empty">
          <p>No posts yet.</p>
          <Link to="/admin/blog/new" className="btn-outline">Write your first post</Link>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Published</th>
              <th>Updated</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id}>
                <td><Link to="/admin/blog/$id" params={{ id: p.id }}>{p.title}</Link></td>
                <td><span className={`admin-pill s-${p.status}`}>{p.status}</span></td>
                <td>{p.published_at ? new Date(p.published_at).toLocaleDateString() : "—"}</td>
                <td>{new Date(p.updated_at).toLocaleDateString()}</td>
                <td className="admin-row-actions">
                  <Link to="/admin/blog/$id" params={{ id: p.id }} className="admin-link">Edit</Link>
                  <button onClick={() => remove(p.id)} className="admin-link danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
