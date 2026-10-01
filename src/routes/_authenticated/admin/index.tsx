import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type PostStats = {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
};

const EMPTY_STATS: PostStats = {
  total: 0,
  published: 0,
  drafts: 0,
  scheduled: 0,
};

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<PostStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canManageSettings, setCanManageSettings] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!isMounted) return;

        if (authData.user) {
          const { data: roles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", authData.user.id);

          if (!isMounted) return;
          setCanManageSettings(!rolesError && (roles ?? []).some(({ role }) => role === "admin"));
        }

        const { data: posts, error: postsError } = await supabase
          .from("blog_posts")
          .select("status");

        if (!isMounted) return;
        if (postsError) {
          if (import.meta.env.DEV) {
            console.error("Dashboard post statistics could not be loaded", postsError);
          }
          setError(
            "We couldn't load your post statistics. Please refresh the page. If the problem continues, contact support.",
          );
          return;
        }

        const rows = posts ?? [];
        setStats({
          total: rows.length,
          published: rows.filter(({ status }) => status === "published").length,
          drafts: rows.filter(({ status }) => status === "draft").length,
          scheduled: rows.filter(({ status }) => status === "scheduled").length,
        });
      } catch (loadError) {
        if (isMounted) {
          if (import.meta.env.DEV) {
            console.error("Admin dashboard could not be loaded", loadError);
          }
          setError(
            "We couldn't load the dashboard right now. Please refresh the page. If the problem continues, contact support.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    { label: "Total Posts", value: stats.total },
    { label: "Published", value: stats.published },
    { label: "Drafts", value: stats.drafts },
    { label: "Scheduled", value: stats.scheduled },
  ];

  return (
    <section className="admin-page" aria-labelledby="admin-dashboard-title">
      <h1 id="admin-dashboard-title" className="admin-h1">
        Dashboard
      </h1>
      <p className="admin-lead">Manage your blog, branding and site settings from here.</p>

      {error && (
        <div className="admin-alert error" role="alert">
          {error}
        </div>
      )}

      <div className="admin-stats" aria-busy={loading}>
        {cards.map(({ label, value }) => (
          <article className="admin-stat" key={label}>
            <div className="admin-stat-num">{loading ? "—" : value}</div>
            <div className="admin-stat-lbl">{label}</div>
          </article>
        ))}
      </div>

      <div className="admin-actions">
        <Link className="btn-large" to="/admin/blog/new">
          Write a New Post
        </Link>
        {canManageSettings && (
          <Link className="btn-outline" to="/admin/settings">
            Site Settings
          </Link>
        )}
      </div>
    </section>
  );
}
