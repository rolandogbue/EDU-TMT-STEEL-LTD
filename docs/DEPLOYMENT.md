# GitHub, Vercel, and Supabase deployment

The application runs as a TanStack Start server built by Vite and Nitro. GitHub
stores the source and runs checks, Vercel builds and serves the web app, and
Supabase provides Postgres, authentication, and file storage. The application
uses the standard Vite, TanStack Start, and Supabase clients directly.

## Deployment flow

1. Push a branch or open a pull request in GitHub. The `CI` workflow runs lint,
   TypeScript, and a production build.
2. Connect the repository to Vercel. Pull requests receive Preview deployments;
   merges to the configured production branch deploy Production.
3. Apply Supabase schema changes from the `Supabase migrations` workflow after
   reviewing the migrations in the pull request. This workflow is manual so a
   schema change is not applied to production just because a commit merged.

## Vercel settings

Use these project build settings:

| Setting          | Value                       |
| ---------------- | --------------------------- |
| Install command  | `npm ci`                    |
| Build command    | `npm run build`             |
| Output directory | Leave the framework default |

The `vercel.json` framework entry helps Vercel identify TanStack Start. Nitro
creates the server output in the format Vercel expects.

Configure the following variables for Preview and Production environments:

| Name                            | Scope                    | Purpose                                       |
| ------------------------------- | ------------------------ | --------------------------------------------- |
| `VITE_SUPABASE_URL`             | Browser build            | Supabase project URL used by browser requests |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser build            | Public Supabase key used with RLS policies    |
| `SUPABASE_URL`                  | Server runtime           | Supabase project URL used during SSR          |
| `SUPABASE_PUBLISHABLE_KEY`      | Server runtime           | Public key used for server-side user requests |
| `SUPABASE_SECRET_KEY`           | Server runtime, optional | Restricted admin bootstrap/team operations    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server runtime, legacy   | Legacy name for the server secret key         |

The service-role key bypasses RLS. Add it only as a Vercel server environment
variable; never name it with a `VITE_` prefix and never commit it to GitHub.
Vercel build-time `VITE_` values require a new deployment after they change.

## Supabase setup

1. Create a Supabase project and record its project ref, URL, and publishable
   key.
2. Set the initial administrator email in the initial SQL migration before
   applying it for the first time.
3. Link the CLI, inspect `npx supabase migration list --linked`, and apply
   pending migrations with `npx supabase db push`, or use the GitHub workflow
   below. Supabase compares the timestamp version at the start of each file;
   the descriptive filename suffix does not create a separate version.
4. In Supabase Authentication settings, set the site URL to the production
   domain and add the Vercel Preview domains you use to the redirect URL list.
5. Create the administrator account at `/auth` after migrations have been
   applied.

## GitHub migration workflow

The manual workflow in `.github/workflows/deploy-supabase-migrations.yml` runs
`supabase db push --dry-run` before applying migrations against the project ref
selected at dispatch. Add these in
GitHub repository **Settings → Secrets and variables → Actions**:

- Secret `SUPABASE_ACCESS_TOKEN`: Supabase personal access token used by the CLI.
- Secret `SUPABASE_DB_PASSWORD`: database password for the selected project.
- Variable `SUPABASE_PROJECT_REF`: project ref, for example `abcdefghijklmno`.

Run **Actions → Supabase migrations → Run workflow** after the migrations have
been reviewed. The workflow requires the selected ref to equal the configured
project ref, which helps prevent applying production migrations to the wrong
project.

Before migration deployment, make sure local and remote versions agree. A
linked reset (`supabase db reset --linked`) destroys remote user-created
database objects and data before replaying local migrations. Use it only for a
disposable project. When the schema is correct but migration history is wrong,
diagnose the specific version mismatch and repair only that tracking entry;
`supabase migration repair` changes migration history but does not run or undo
the migration SQL.

## Environment files and secrets

`.env.example` documents the local configuration. Copy it to `.env` for local
development; `.gitignore` excludes `.env` and other local environment files.
The browser publishable key is public, but database RLS policies must remain
enabled. Do not commit database passwords, access tokens, or service-role keys.

## Troubleshooting

| Symptom                                  | Check                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| Missing Supabase variables               | Configure the `VITE_` pair and server pair in Vercel, then redeploy.                 |
| Sign-in works but admin pages are denied | Confirm migrations ran and the signed-in user has the intended role.                 |
| Uploads fail                             | Confirm the `site-assets` storage policies from the migrations are installed.        |
| Migration action fails to authenticate   | Check the project access token, database password, and project ref secrets/variable. |
| Local build fails during install         | Use Node 22 and `npm ci` so the lockfile is respected.                               |
