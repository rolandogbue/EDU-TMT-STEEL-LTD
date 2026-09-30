# Developer guide

This guide introduces the main parts of the site and explains where to make common changes. It complements the deployment steps in [SETUP.md](../SETUP.md) and the architecture notes in [README.md](README.md).

## How a request becomes a page

1. `src/router.tsx` creates a TanStack Router and provides a React Query client.
2. Files in `src/routes/` define URLs. For example, `routes/products.tsx` renders `/products`; `routes/blog/$slug.tsx` uses `$slug` as a URL parameter.
3. `routes/__root.tsx` supplies document metadata, shared header/footer, providers, and the page outlet. `Outlet` is where the matched child route renders.
4. `src/start.ts` registers server-function middleware. `src/server.ts` adapts TanStack Start's server entry to the hosting runtime and turns catastrophic SSR errors into a readable HTML response.

The router creates `src/routeTree.gen.ts` from route files. Treat this file as generated output; add or rename route files and let the router plugin update the tree.

## Main folders

| Location | Responsibility | Start here when… |
| --- | --- | --- |
| `src/routes/` | Pages, route loaders, metadata, and API endpoints | Adding a page or changing URL behavior |
| `src/components/` | Shared site sections and admin editor | Updating reusable page UI |
| `src/components/ui/` | Reusable accessible UI primitives | Building controls from the existing component set |
| `src/content/site.ts` | Product, service, audience, and contact copy | Editing marketing content that is not CMS-managed |
| `src/integrations/supabase/` | Browser/server clients, request auth middleware, generated DB types | Changing how the app connects to Supabase |
| `src/lib/` | Auth/settings state, server-only role checks, image helpers | Changing shared application behavior |
| `src/styles/` | Design tokens and page/section styles | Changing visual design |
| `supabase/migrations/` | Ordered SQL schema and policy changes | Adding or changing database schema/security |

The UI primitives mostly wrap Radix components and standardize styling, keyboard behavior, and accessibility. Prefer composing these wrappers over copying their implementation into page files.

## Supabase clients and security

- `integrations/supabase/client.ts` is the browser client. It uses the publishable key, persists the user's session, and relies on row-level security (RLS) for data access.
- `auth-attacher.ts` reads the current browser session and attaches its access token to TanStack server-function calls.
- `auth-middleware.ts` validates that bearer token on the server and builds a request-scoped Supabase client. Use this client for work performed on behalf of the signed-in user.
- `client.server.ts` creates a server-only client with `SUPABASE_SERVICE_ROLE_KEY`. It bypasses RLS, so use it only after checking the caller's role in trusted server code. Never import it into browser components or expose its key with a `VITE_` variable.
- `team.server.ts` verifies admin access. `team.functions.ts` defines the server actions called by the Team & roles screen.

When adding data access, prefer the publishable client plus RLS. Use the service-role client only when Supabase's admin API is required, and keep authorization checks on the server even if the UI hides a button.

## Sign-in and roles

`routes/auth.tsx` handles password sign-in and signup. The first admin is associated with the email in `site_settings.admin_email`; the database trigger in the initial migration grants the admin role when that account is created. The one-time bootstrap API uses the server-only key. A user's role is stored separately in `user_roles` rather than trusted from browser-supplied form data.

`routes/_authenticated/route.tsx` protects signed-in pages. `routes/_authenticated/admin/route.tsx` loads the user's roles and renders the admin shell for admins and content managers. Admin-only actions must still be verified in the server function and database policies.

## Blog data flow

- The public blog index queries only published posts, orders them by publication date, and requests one page at a time.
- The `$slug` route loads one published post and uses its SEO fields to build page metadata.
- `components/admin/post-editor.tsx` loads categories/tags, resizes cover images, saves the post row, and synchronizes tag links.
- `routes/_authenticated/admin/settings.tsx` manages branding, categories, account details, and team roles.
- Images are uploaded to the public-read `site-assets` bucket. The post/settings records keep public URLs; responsive post covers also store a width-to-URL map.

## Database migrations

Migration filenames begin with a timestamp. Keep that timestamp prefix so Supabase can order and track schema changes. Add a new migration instead of editing an already-applied one. For each new table, define grants, enable RLS, and add policies in the same change. Read `SETUP.md` before applying migrations to a production project.

The migration suffix describes the change; the SQL file, not the filename, is the authoritative schema change. Generated types in `src/integrations/supabase/types.ts` should be refreshed from the linked project when the schema changes rather than edited by hand.

## Styling and content

Marketing copy and product/service data is centralized in `src/content/site.ts`; shared display components are in `src/components/site-sections.tsx`. Page-specific layout stays in each route, while CSS is grouped by base styles, components, layout, sections, and pages under `src/styles/`.

## Useful commands

```sh
npm ci             # Install exactly what package-lock.json records
npm run dev        # Start the local site at http://localhost:8080
npm run build      # Build the default Cloudflare Worker target
$env:VERCEL = '1'; npm run build  # Build the Vercel target in PowerShell
```

Before changing a flow, trace it from the route/component through the Supabase client and into the migration/RLS policy. That makes it easier to preserve both user experience and server-side security.
