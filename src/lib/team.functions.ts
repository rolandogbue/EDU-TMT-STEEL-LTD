import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Keep accepted values aligned with public.app_role in the SQL migrations.
const roleEnum = z.enum(["admin", "content_manager"]);

const inviteSchema = z.object({
  email: z.string().trim().email().max(255),
  role: roleEnum,
  password: z.string().min(8).max(72).optional(),
});

const setRoleSchema = z.object({
  user_id: z.string().uuid(),
  role: roleEnum,
});

const removeSchema = z.object({ user_id: z.string().uuid(), role: roleEnum });

/** Return role assignments with Auth email addresses for the settings screen. */
export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { assertAdmin } = await import("./team.server");
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("id,user_id,role,created_at")
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);

    // Role rows store user IDs, so look up emails through the Auth Admin API.
    const ids = Array.from(new Set((roles ?? []).map((r) => r.user_id)));
    const emailMap = new Map<string, string>();
    for (const id of ids) {
      const { data: u } = await supabaseAdmin.auth.admin.getUserById(id);
      if (u.user) emailMap.set(id, u.user.email ?? "");
    }
    return (roles ?? []).map((r) => ({ ...r, email: emailMap.get(r.user_id) ?? "" }));
  });

/** Create/reuse a Supabase Auth user, then grant the selected application role. */
export const inviteMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => inviteSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./team.server");
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Reuse an existing Auth user when possible; otherwise create a confirmed
    // account, then grant the requested application role in user_roles.
    let userId: string | null = null;
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const found = list?.users?.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (found) {
      userId = found.id;
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password ?? "ChangeMe123!",
        email_confirm: true,
      });
      if (createErr || !created.user) throw new Error(createErr?.message ?? "Failed to create user");
      userId = created.user.id;
    }

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: data.role }, { onConflict: "user_id,role", ignoreDuplicates: true });
    if (roleErr) throw new Error(roleErr.message);

    return { ok: true, user_id: userId, created: !found };
  });

/** Remove one role assignment without deleting the person's Auth account. */
export const removeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => removeSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./team.server");
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Removing a role revokes application access but does not delete the login.
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.user_id)
      .eq("role", data.role);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Add a role assignment; `ignoreDuplicates` keeps repeated promotions idempotent. */
export const changeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => setRoleSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { assertAdmin } = await import("./team.server");
    await assertAdmin(context as never);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.user_id, role: data.role }, { onConflict: "user_id,role", ignoreDuplicates: true });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
