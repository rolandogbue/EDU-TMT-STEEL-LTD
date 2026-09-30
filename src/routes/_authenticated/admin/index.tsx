import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-hooks";

export const Route = createFileRoute("/_authenticated/admin/")({
  // Child route for `/admin`, rendered inside the role-checked admin layout.
  component: AdminDashboard,
});

function AdminDashboard() {
  const { isAdmin } = useAuth();
  return (
    <section className="admin-page">
      <div className="section-label">Admin</div>
      <h1>Dashboard</h1>
      <p>Manage the website content and settings for EDU TMT Steel.</p>
      <div className="cta-buttons">
        <Link className="btn-large" to="/admin/blog">Manage blog</Link>
        {isAdmin && <Link className="btn-outline" to="/admin/settings">Site settings</Link>}
      </div>
    </section>
  );
}
