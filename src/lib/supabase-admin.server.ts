/**
 * Guard helpers for the service-role Supabase client.
 *
 * `SUPABASE_SERVICE_ROLE_KEY` is a server-side secret. Without this guard, any code
 * path touching `supabaseAdmin` throws an opaque error that surfaces as a 500
 * or a blank page. See SETUP.md for setup instructions.
 */

export const ADMIN_KEY_MISSING_MESSAGE =
  "Server admin key not configured in this environment. Admin account bootstrap and team management require SUPABASE_SERVICE_ROLE_KEY on the server — see SETUP.md.";

/** True when the server has both the backend URL and the service-role key. */
export function isServiceRoleConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Throws a human-readable error when the service-role key is unavailable. */
export function assertServiceRoleConfigured(): void {
  if (!isServiceRoleConfigured()) throw new Error(ADMIN_KEY_MISSING_MESSAGE);
}
