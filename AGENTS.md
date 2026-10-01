# Project maintenance notes

- Preserve the existing site design and component behavior when working on deployment configuration.
- Keep secrets out of source control. Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `VITE_` variable.
- Add database changes as new, timestamped migrations in `supabase/migrations/`.
- Let the TanStack Router plugin regenerate `src/routeTree.gen.ts`; do not edit it by hand.
- Use clear names and short comments to explain intent where it is not obvious from the code.
