import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/lib/site-settings";
import { changeRole, inviteMember, listTeam, removeRole } from "@/lib/team.functions";


export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

type Category = { id: string; name: string; slug: string };

function SettingsPage() {
  const { settings, refresh } = useSiteSettings();
  const [logoUrl, setLogoUrl] = useState<string | null>(settings.logo_url);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(settings.favicon_url);
  const [uploading, setUploading] = useState<"logo" | "favicon" | null>(null);
  const [savingSite, setSavingSite] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updatingAccount, setUpdatingAccount] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catName, setCatName] = useState("");

  type TeamRow = { id: string; user_id: string; role: "admin" | "content_manager"; email: string };
  const listTeamFn = useServerFn(listTeam);
  const inviteFn = useServerFn(inviteMember);
  const removeFn = useServerFn(removeRole);
  const changeFn = useServerFn(changeRole);
  const [team, setTeam] = useState<TeamRow[]>([]);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "content_manager">("content_manager");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviting, setInviting] = useState(false);

  const loadTeam = useCallback(async () => {
    // Team reads use authenticated server functions so private Auth Admin API
    // calls and service-role credentials stay on the server.
    try {
      const rows = await listTeamFn();
      setTeam(rows as TeamRow[]);
      setTeamError(null);
    } catch (e) {
      // Surfaced in the UI so a missing server admin key is visible on the page
      // rather than only in the server terminal. See SETUP.md.
      setTeamError(e instanceof Error ? e.message : "Could not load team members.");
    }
  }, [listTeamFn]);



  useEffect(() => {
    setLogoUrl(settings.logo_url);
    setFaviconUrl(settings.favicon_url);
  }, [settings.logo_url, settings.favicon_url]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
    loadCategories();
    loadTeam();
  }, [loadTeam]);


  const loadCategories = async () => {
    const { data } = await supabase.from("blog_categories").select("id,name,slug").order("name");
    setCategories((data ?? []) as Category[]);
  };

  const upload = useCallback(async (file: File, kind: "logo" | "favicon") => {
    setError(null); setMsg(null); setUploading(kind);
    try {
      // Use a unique key so previous assets remain available if settings updates fail.
      const ext = file.name.split(".").pop() || "png";
      const path = `${kind}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      if (kind === "logo") setLogoUrl(data.publicUrl);
      else setFaviconUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }, []);

  const saveSite = async () => {
    // Uploading a file does not make it active; this save writes its URL to the
    // singleton settings row and refreshes the shared site-settings context.
    setError(null); setMsg(null); setSavingSite(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ logo_url: logoUrl, favicon_url: faviconUrl })
      .eq("id", 1);
    if (error) setError(error.message);
    else {
      setMsg("Site settings saved");
      await refresh();
    }
    setSavingSite(false);
  };

  const updateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setMsg(null); setUpdatingAccount(true);
    // Send only fields the administrator changed so blank inputs keep current values.
    const updates: { email?: string; password?: string } = {};
    if (newEmail && newEmail !== email) updates.email = newEmail.trim();
    if (newPassword) {
      if (newPassword.length < 8) { setError("Password must be at least 8 characters"); setUpdatingAccount(false); return; }
      updates.password = newPassword;
    }
    if (!Object.keys(updates).length) { setError("Nothing to update"); setUpdatingAccount(false); return; }
    const { error } = await supabase.auth.updateUser(updates);
    if (error) setError(error.message);
    else {
      setMsg("Account updated. If you changed your email, check your inbox to confirm.");
      setNewEmail(""); setNewPassword("");
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? "");
    }
    setUpdatingAccount(false);
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    // The database uses a unique slug for stable category references.
    const slug = catName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    await supabase.from("blog_categories").insert({ name: catName.trim(), slug });
    setCatName("");
    loadCategories();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await supabase.from("blog_categories").delete().eq("id", id);
    loadCategories();
  };

  const submitInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setMsg(null);
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      // The server function validates the input, checks admin role, and performs
      // user creation/role assignment with the service-role client.
      const res = await inviteFn({
        data: {
          email: inviteEmail.trim(),
          role: inviteRole,
          password: invitePassword.trim() || undefined,
        },
      });
      setMsg(res.created
        ? `Created ${inviteEmail} with role ${inviteRole}. Default password: ${invitePassword.trim() || "ChangeMe123!"} — share securely.`
        : `Granted ${inviteRole} to ${inviteEmail}.`);
      setInviteEmail(""); setInvitePassword("");
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invite failed");
    } finally {
      setInviting(false);
    }
  };

  const revoke = async (row: TeamRow) => {
    if (!confirm(`Remove ${row.role} role from ${row.email}?`)) return;
    try {
      await removeFn({ data: { user_id: row.user_id, role: row.role } });
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    }
  };

  const promote = async (row: TeamRow, next: "admin" | "content_manager") => {
    try {
      await changeFn({ data: { user_id: row.user_id, role: next } });
      await loadTeam();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };


  return (
    <div className="admin-page">
      <h1 className="admin-h1">Site settings</h1>
      {error && <div className="admin-alert error" role="alert">{error}</div>}
      {msg && <div className="admin-alert ok">{msg}</div>}

      <section className="admin-section">
        <h2 className="admin-h2">Branding</h2>
        <div className="branding-grid">
          <div className="admin-panel">
            <h3>Custom logo</h3>
            <p className="admin-hint">Displayed in the site header. Square PNG or SVG recommended.</p>
            <div className="brand-preview">
              {logoUrl ? <img src={logoUrl} alt="Logo preview" /> : <div className="brand-empty">No custom logo</div>}
            </div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              disabled={uploading === "logo"}
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "logo")}
            />
            {logoUrl && <button className="admin-link danger" onClick={() => setLogoUrl(null)}>Reset to default</button>}
          </div>

          <div className="admin-panel">
            <h3>Favicon</h3>
            <p className="admin-hint">Shown in the browser tab. 32x32 or 64x64 PNG works best.</p>
            <div className="brand-preview small">
              {faviconUrl ? <img src={faviconUrl} alt="Favicon preview" /> : <div className="brand-empty">Default favicon</div>}
            </div>
            <input
              type="file"
              accept="image/png,image/x-icon,image/svg+xml,image/webp"
              disabled={uploading === "favicon"}
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "favicon")}
            />
            {faviconUrl && <button className="admin-link danger" onClick={() => setFaviconUrl(null)}>Reset to default</button>}
          </div>
        </div>
        <button className="btn-large" onClick={saveSite} disabled={savingSite}>
          {savingSite ? "Saving…" : "Save branding"}
        </button>
      </section>

      <section className="admin-section">
        <h2 className="admin-h2">Blog categories</h2>
        <form onSubmit={addCategory} className="admin-inline-form">
          <input placeholder="New category name" value={catName} onChange={(e) => setCatName(e.target.value)} />
          <button type="submit" className="btn-outline">Add</button>
        </form>
        <ul className="admin-inline-list">
          {categories.map((c) => (
            <li key={c.id}>
              <span>{c.name}</span>
              <button className="admin-link danger" onClick={() => deleteCategory(c.id)}>Delete</button>
            </li>
          ))}
          {!categories.length && <li className="muted">No categories yet.</li>}
        </ul>
      </section>

      <section className="admin-section">
        <h2 className="admin-h2">Admin account</h2>
        <p className="admin-hint">Current email: <strong>{email}</strong></p>
        <form onSubmit={updateAccount} className="admin-form">
          <label className="admin-field">
            <span>New email (leave blank to keep)</span>
            <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} maxLength={255} />
          </label>
          <label className="admin-field">
            <span>New password (leave blank to keep)</span>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} maxLength={72} autoComplete="new-password" />
          </label>
          <button type="submit" className="btn-large" disabled={updatingAccount}>
            {updatingAccount ? "Updating…" : "Update login details"}
          </button>
        </form>
      </section>

      <section className="admin-section">
        <h2 className="admin-h2">Team &amp; roles</h2>
        <p className="admin-hint">
          Admins can manage everything. Content managers can create and edit blog posts, categories and tags — but cannot change site settings or team.
        </p>
        {teamError && (
          <div className="admin-alert error" role="alert">
            {teamError}
          </div>
        )}
        <form onSubmit={submitInvite} className="admin-form">

          <label className="admin-field">
            <span>Email</span>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              maxLength={255}
              required
              placeholder="editor@example.com"
            />
          </label>
          <label className="admin-field">
            <span>Role</span>
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as "admin" | "content_manager")}>
              <option value="content_manager">Content manager</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Temporary password (optional, ≥ 8 chars — defaults to ChangeMe123!)</span>
            <input
              type="text"
              value={invitePassword}
              onChange={(e) => setInvitePassword(e.target.value)}
              minLength={8}
              maxLength={72}
              autoComplete="off"
            />
          </label>
          <button type="submit" className="btn-large" disabled={inviting}>
            {inviting ? "Working…" : "Add / grant role"}
          </button>
        </form>

        <ul className="admin-inline-list" style={{ marginTop: "1rem" }}>
          {team.length === 0 && <li className="muted">No team members yet.</li>}
          {team.map((row) => (
            <li key={row.id}>
              <span>
                <strong>{row.email || row.user_id}</strong> — {row.role.replace("_", " ")}
              </span>
              <span style={{ display: "flex", gap: ".5rem" }}>
                {row.role === "content_manager" && (
                  <button className="admin-link" onClick={() => promote(row, "admin")}>Make admin</button>
                )}
                {row.role === "admin" && (
                  <button className="admin-link" onClick={() => promote(row, "content_manager")}>Add content manager</button>
                )}
                <button className="admin-link danger" onClick={() => revoke(row)}>Revoke</button>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

}
