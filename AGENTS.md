# Project instructions

- Keep secrets out of source control. Never place service-role keys in `VITE_` variables.
- Apply database schema changes as new files in `supabase/migrations/`.
- Keep generated files such as `src/routeTree.gen.ts` in sync through the router tooling; do not hand edit them.
