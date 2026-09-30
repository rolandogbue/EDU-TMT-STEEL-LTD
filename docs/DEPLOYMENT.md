# Deployment

The app is a server-rendered TanStack Start application. Deploy its server to a host you control and connect it to a Supabase project you own. Public pages, authentication, blog content, and uploaded assets all use the configured Supabase backend.

## Before deployment

1. Create your Supabase project and follow [SETUP.md](../SETUP.md) to apply migrations, create the `site-assets` bucket, set the initial admin email, and configure Auth redirect URLs.
2. If you are moving from a different backend, migrate database records and Storage files before switching traffic. Auth passwords are not exportable; users will need invitations or password resets. Keep the old backend until you have verified the new one.
3. Build with Node.js 22+ and npm:

   ```sh
   npm ci
   npm run build
   ```

The Vite config emits a Cloudflare Worker by default and uses Vercel's build output when `VERCEL=1` is set. Set the environment variables below on the host. `VITE_` values are embedded during the build, so configure them before building.

## Required environment

| Variable                        | Notes                                                          |
| ------------------------------- | -------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Your project's public URL; used in the browser bundle          |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your project's publishable/anon key; public by design          |
| `SUPABASE_URL`                  | Same project URL, available to the server runtime              |
| `SUPABASE_PUBLISHABLE_KEY`      | Same publishable key, available to the server runtime          |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server-only secret; enables bootstrap and team/role management |

Keep the service-role key in the host's secret manager. It bypasses row-level security and must never be exposed in browser code or committed to the repository. If omitted, the app will still use Supabase for public site, sign-in, and blog operations, but the initial-admin bootstrap and Team & roles admin functions are disabled.

## Cloudflare Workers

The repository includes `wrangler.toml` and builds to a Worker by default.

```sh
npx wrangler login
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_PUBLISHABLE_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler deploy
```

For a deploy preview, use `npx wrangler deploy --dry-run`. Add the `VITE_` variables to the build environment in CI before `npm run build`.

## Vercel

Import the repository into Vercel and set the Build Command to `npm run build` and Install Command to `npm ci`. Add all five environment variables above for each environment. Vercel sets `VERCEL=1` during build. Redeploy after changing build-time `VITE_` values.

## After deployment

1. Confirm the homepage and `/sitemap.xml` load.
2. Sign in at `/auth` with the initial admin account and immediately change its initial password.
3. Confirm `/admin` opens, create a draft blog post, and check that images can be uploaded to `site-assets`.
4. Publish a post and confirm it appears on `/blog`.

## Backend switch checklist

Pointing the app at a different Supabase URL switches which backend it reads; it does not transfer data. Before switching production traffic, copy the needed `site_settings`, categories, tags, posts, and Storage objects; create or invite users in the new Auth project; and verify access policies, redirect URLs, and image URLs. The SQL migrations create the schema, not a copy of production data.
