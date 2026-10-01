/**
 * Guard helpers for the service-role Supabase client.
 *
 * `SUPABASE_SECRET_KEY` (or the legacy `SUPABASE_SERVICE_ROLE_KEY`) is a
 * private server variable. It is optional
 * unless server-only admin functions are needed. Without this guard, a code
 * path touching `supabaseAdmin` would fail with an unclear server error.
 */

export const ADMIN_KEY_MISSING_MESSAGE =
  "Server admin key not configured in this environment. Admin account bootstrap and team management require SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY on the server — see SETUP.md.";

/** True when the server has both the backend URL and the service-role key. */
export function isServiceRoleConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL &&
    (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY),
  );
}

/** Throws a human-readable error when the service-role key is unavailable. */
export function assertServiceRoleConfigured(): void {
  if (!isServiceRoleConfigured()) throw new Error(ADMIN_KEY_MISSING_MESSAGE);
}
