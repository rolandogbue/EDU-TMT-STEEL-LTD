# Self-hosted setup with your own Supabase project

This repository runs the website and server on infrastructure you choose. Supabase provides the database, authentication, and file storage. The app has no hosted-site-builder runtime dependency.

## Requirements

- Node.js 22 or newer (`.nvmrc` pins the major version).
- npm (included with Node.js).
- A Supabase project you own.

## Create and configure Supabase

1. Create a Supabase project and copy its project URL, publishable key, and project reference.
2. Install the Supabase CLI, then link this repository to your project:

   ```sh
   npm install --save-dev supabase
   npx supabase --version

   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```

   This applies the checked-in schema migrations in `supabase/migrations/` to your project. Review those SQL files before applying them.

3. In Supabase Storage, create a **public** bucket named `site-assets` for logos, favicons, and blog images. The included migrations add access policies for this bucket.
4. In the `site_settings` table, set the singleton row's `admin_email` to the email address you will use to create the first admin account.
5. Configure Supabase Auth's site URL and allowed redirect URLs for local development and your production domain.

The migrations create the site's schema and security policies. They do not copy existing content, users, or uploaded files from another Supabase project. Existing Auth users cannot be transferred with their passwords; plan account invitations or password resets as part of a backend migration.

## Configure environment variables

Copy `.env.example` to `.env` and set:

| Variable                        | Used by        | Value                                                           |
| ------------------------------- | -------------- | --------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Browser bundle | Your Supabase project URL                                       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser bundle | Your project's publishable key (or legacy anon key)             |
| `SUPABASE_URL`                  | Server         | Same project URL                                                |
| `SUPABASE_PUBLISHABLE_KEY`      | Server         | Same publishable key                                            |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server only    | Service-role/secret key for admin bootstrap and team management |

The publishable key is designed to be public; row-level security protects data access. The service-role key bypasses row-level security and must only be configured as a server secret. Never add it to a `VITE_` variable or commit it.

## Install and run

```sh
nvm use          # if using nvm
npm ci
npm run dev      # http://localhost:8080
```

Production commands:

```sh
npm run build
npm run preview
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment options. This is a server-rendered TanStack Start app; its build is not a static website bundle.

## First admin and team management

With your own `SUPABASE_SERVICE_ROLE_KEY` set on the server, the bootstrap endpoint can create the first admin for the email in `site_settings`. Sign in, change the initial password immediately, then manage roles in **Admin → Site settings → Team & roles**. Without the server key, those two account-management features are intentionally unavailable; public pages, blog viewing, sign-in, and blog editing by users who already have a role can still use the publishable key and database policies.

## Database changes

Add future schema changes as new SQL files under `supabase/migrations/`, then review and apply them with `supabase db push`. Do not edit `src/integrations/supabase/types.ts` manually; regenerate it from your linked project when the schema changes.

For a beginner-friendly map of the routes, Supabase request flow, roles, blog editor, and styles, start with [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md).
