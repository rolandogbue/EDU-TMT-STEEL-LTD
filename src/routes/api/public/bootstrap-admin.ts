import { createFileRoute } from "@tanstack/react-router";

export const DEFAULT_ADMIN_PASSWORD = "ChangeMe123!";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      POST: async () => {
        const { isServiceRoleConfigured, ADMIN_KEY_MISSING_MESSAGE } = await import(
          "@/lib/supabase-admin.server"
        );
        if (!isServiceRoleConfigured()) {
          return Response.json({ error: ADMIN_KEY_MISSING_MESSAGE }, { status: 503 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");


        // Refuse if any admin already exists.
        const { data: existing, error: existingErr } = await supabaseAdmin
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin")
          .limit(1);
        if (existingErr) return Response.json({ error: existingErr.message }, { status: 500 });
        if (existing && existing.length > 0) {
          return Response.json({ error: "Admin already exists" }, { status: 409 });
        }

        const { data: settings, error: setErr } = await supabaseAdmin
          .from("site_settings")
          .select("admin_email")
          .eq("id", 1)
          .maybeSingle();
        if (setErr || !settings) return Response.json({ error: "Missing site settings" }, { status: 500 });

        const email = settings.admin_email;

        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: DEFAULT_ADMIN_PASSWORD,
          email_confirm: true,
        });
        if (createErr || !created.user) {
          return Response.json({ error: createErr?.message ?? "Failed to create admin" }, { status: 500 });
        }

        // grant_admin_on_signup trigger inserts the role automatically.
        return Response.json({
          ok: true,
          email,
          password: DEFAULT_ADMIN_PASSWORD,
          notice: "Change this password after first sign in via Admin → Site settings.",
        });
      },
    },
  },
});
