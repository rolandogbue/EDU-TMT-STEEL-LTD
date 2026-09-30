import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — EDU TMT Steel Admin" },
      { name: "description", content: "Administrator sign in for EDU TMT Steel." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

// Validate before calling Auth so malformed values get a clear form message.
const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);

  // Returning visitors with an active session can go straight to the admin area.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setInfo(null);
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setLoading(true);
    try {
      // Signup is enabled for the initial admin email; Supabase's database trigger
      // grants that role. Normal returning users use password sign-in.
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
      }
      navigate({ to: "/admin" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const bootstrapAdmin = async () => {
    setError(null); setInfo(null); setBootstrapping(true);
    try {
      // This server endpoint needs the private service-role key and refuses to
      // create a second admin. The returned default password must be changed.
      const res = await fetch("/api/public/bootstrap-admin", { method: "POST" });
      const json = (await res.json()) as { ok?: boolean; email?: string; password?: string; error?: string };
      if (!res.ok) setError(json.error ?? "Bootstrap failed");
      else if (json.ok && json.email && json.password) {
        setEmail(json.email);
        setPassword(json.password);
        setInfo(`Default admin created — Email: ${json.email} · Password: ${json.password}. Sign in and change the password immediately.`);
      }
    } catch { setError("Bootstrap failed"); }
    finally { setBootstrapping(false); }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <Link to="/" className="auth-back">← Back to site</Link>
        <h1 className="auth-title">{mode === "signin" ? "Admin Sign In" : "Create Admin Account"}</h1>
        <p className="auth-sub">
          {mode === "signup"
            ? "First-time setup: use the configured admin email to become admin automatically."
            : "Sign in to manage your site content and settings."}
        </p>
        <form onSubmit={submit} className="auth-form">
          <label>
            <span>Email</span>
            <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
          </label>
          <label>
            <span>Password</span>
            <input type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={8} maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <div className="auth-error" role="alert">{error}</div>}
          {info && <div className="auth-info" role="status">{info}</div>}
          <button type="submit" className="btn-large" disabled={loading}>
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button type="button" className="auth-toggle" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
          {mode === "signin" ? "First time? Create the admin account →" : "Already have an account? Sign in →"}
        </button>
        <div className="auth-bootstrap">
          <button type="button" className="auth-link" onClick={bootstrapAdmin} disabled={bootstrapping}>
            {bootstrapping ? "Creating default admin…" : "Create default admin (first-run only)"}
          </button>
          <p className="auth-hint">One-time setup: creates the admin account with a default password so you can sign in and change it right away.</p>
        </div>
      </div>
    </div>
  );
}
