/**
 * Server-only helpers for team & role management.
 *
 * Lives in a `*.server.ts` module (not next to the server functions) so the
 * server-function splitter cannot strip it, and so it can never be reached
 * from a client bundle.
 */
import { assertServiceRoleConfigured } from "./supabase-admin.server";

type AuthedContext = { supabase: unknown; userId: string };

/**
 * Verifies the caller holds the admin role AND that this environment has a
 * service-role key, so a missing key surfaces as a readable message rather
 * than an opaque 500. See SETUP.md.
 */
export async function assertAdmin(context: AuthedContext) {
  assertServiceRoleConfigured();

  const { data, error } = await (
    context.supabase as {
      rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
    }
  ).rpc("has_role", { _user_id: context.userId, _role: "admin" });

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}
