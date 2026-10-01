# Local development and deployment setup

This guide takes you from a fresh checkout to a local development server. The
site uses TanStack Start for React routing and server rendering, Supabase for
database/authentication/storage, GitHub for source control and CI, and Vercel
for hosting.

## 1. Install requirements

- Node.js 22 (the `.nvmrc` file records the project version)
- npm 10 or newer
- A Supabase project you control

Check Node and npm, then install the exact dependencies recorded in the lock
file:

```sh
node --version
npm --version
npm ci
```

## 2. Configure Supabase

Create a project in Supabase. Copy the Project URL and publishable key from
**Project Settings → API**. The publishable key is safe for browser use when
Row Level Security (RLS) policies are enabled; the service-role key is private.

Copy `.env.example` to `.env` and fill in the URL and publishable key in both
the browser and server entries. `VITE_` values are embedded in browser code, so
they must only contain public configuration. Keep `SUPABASE_PUBLISHABLE_KEY`
equal to the browser's `VITE_SUPABASE_PUBLISHABLE_KEY`; do not put a secret key
in either publishable-key variable. Team management also requires a server-only
`SUPABASE_SECRET_KEY` (or the legacy `SUPABASE_SERVICE_ROLE_KEY`).

Apply the schema to your new project using the Supabase CLI:

```sh
npx supabase login
npx supabase link --project-ref YOUR_SUPABASE_PROJECT_REF
npx supabase migration list --linked
npx supabase db push
```

The project ref is the short identifier in your Supabase project URL. The
migrations create the blog tables, roles, policies, site settings, and storage
access policies. Review the SQL in `supabase/migrations/` before applying it.
The timestamp at the beginning of each filename is the migration version; the
descriptive suffix is only a label. Keep each version unique. If `migration
list` or `db push` reports mismatched history, stop and compare the local files
with the remote history before changing anything.

For a disposable remote project that should be rebuilt from these migrations,
`npx supabase db reset --linked` drops remote user-created database objects and
replays every local migration. It deletes database data. Do not use it for a
project whose data must be kept. If the schema is correct but history records
are wrong, inspect `npx supabase migration repair --help` and repair only the
specific version after verifying the database state.

Set the first administrator email to the address you will use to sign in by
updating the `admin_email` value inserted in the initial migration before its
first application. Then create that user through the site's `/auth` page. Keep
the service-role key off your computer and out of Git unless you specifically
need the server-only team-management and admin-bootstrap functions locally.

## 3. Run the website

```sh
npm run dev
```

Open <http://localhost:8080>. Sign-in and content-management features require
the database migrations to have been applied to the configured Supabase
project.

## 4. Validate changes

```sh
npm run lint
npm run typecheck
npm run build
npm run preview
```

The production server uses Nitro. Vercel selects its deployment output
automatically when it builds the project.

## 5. Put the project on GitHub

Create an empty GitHub repository, then push this project:

```sh
git init
git add .
git commit -m "Prepare EDU TMT Steel for deployment"
git branch -M main
git remote add origin https://github.com/rolandogbue/EDU-TMT-STEEL-LTD.git
git push -u origin main
```

The GitHub Actions workflow checks lint, TypeScript, and the production build on
pull requests and pushes. It uses placeholder Supabase values only for the
build; no production credentials are required for CI.

## 6. Deploy on Vercel

1. Import the GitHub repository from the Vercel dashboard.
2. Use the detected framework settings, with `npm ci` as the install command
   and `npm run build` as the build command.
3. Add `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`,
   `VITE_SUPABASE_URL`, and `VITE_SUPABASE_PUBLISHABLE_KEY` for Preview and
   Production, using the same publishable key for both key variables. Add
   `SUPABASE_SECRET_KEY` only if you need the protected server-side team and
   bootstrap features (`SUPABASE_SERVICE_ROLE_KEY` remains supported as a
   legacy variable).
4. Deploy. Vercel creates preview deployments for pull requests and production
   deployments from the production branch.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the GitHub migration workflow,
environment variable reference, and operational details.

## Naming and code map

- `src/routes/` contains pages and API endpoints; file paths define URLs.
- `src/components/` contains shared page sections and the admin editor.
- `src/lib/` contains shared application logic and server functions.
- `src/integrations/supabase/` contains Supabase clients, auth helpers, and
  generated database types.
- `src/styles.css` and `src/styles/` contain the design styles.
- `supabase/migrations/` contains ordered database changes and access rules.

Database tables and columns use descriptive `snake_case` names. TypeScript
functions and variables use descriptive `camelCase`; React components and
types use `PascalCase`. Add comments to explain why a non-obvious decision is
needed, rather than restating what the next line does.
