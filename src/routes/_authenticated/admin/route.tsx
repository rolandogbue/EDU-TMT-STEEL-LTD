import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

type Role = "admin" | "content_manager";

function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null | "none" | "error">(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        const u = data.user;
        setUser(u);
        if (error) {
          setRole("error");
          return;
        }
        if (!u) {
          navigate({ to: "/auth" });
          return;
        }
        const { data: roles, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", u.id);
        if (rolesError) {
          setRole("error");
          return;
        }
        const list = (roles ?? []).map((r) => r.role as Role);
        setRole(list.includes("admin") ? "admin" : list.includes("content_manager") ? "content_manager" : "none");
      } catch (error) {
        if (import.meta.env.DEV) console.error("Could not verify admin access", error);
        setRole("error");
      }
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (role === null) {
    return <div className="admin-loading">Loading admin panel…</div>;
  }

  if (role === "none") {
    return (
      <div className="admin-shell">
        <div className="admin-forbidden">
          <h1>Not authorised</h1>
          <p>Your account <strong>{user?.email}</strong> does not have admin access.</p>
          <button className="btn-outline" onClick={signOut}>Sign out</button>
        </div>
      </div>
    );
  }

  if (role === "error") {
    return (
      <div className="admin-shell">
        <div className="admin-forbidden">
          <h1>Unable to verify access</h1>
          <p>Please refresh the page. If the problem continues, contact support.</p>
          <button className="btn-outline" onClick={signOut}>Sign out</button>
        </div>
      </div>
    );
  }

  const isAdmin = role === "admin";

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-brand">EDU Admin</div>
        <nav>
          <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: "active" }}>Dashboard</Link>
          <Link to="/admin/blog" activeProps={{ className: "active" }}>Blog</Link>
          {isAdmin && (
            <Link to="/admin/settings" activeProps={{ className: "active" }}>Site Settings</Link>
          )}
          <Link to="/">← View site</Link>
        </nav>
        <div className="admin-user">
          <div className="admin-user-email">{user?.email}</div>
          <div className="admin-user-role">{role.replace("_", " ")}</div>
          <button className="admin-signout" onClick={signOut}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
