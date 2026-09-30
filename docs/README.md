# EDU TMT Steel — Project Documentation

Comprehensive technical and operational documentation for the EDU TMT Steel
marketing website and CMS. Written for developers, administrators, and
stakeholders.

---

## Table of Contents

1. [System Overview & Business Objectives](#1-system-overview--business-objectives)
2. [Architecture & Technology Stack](#2-architecture--technology-stack)
3. [Database Schema](#3-database-schema)
4. [Installation & Deployment](#4-installation--deployment)
5. [Environment Configuration](#5-environment-configuration)
6. [Folder & Codebase Structure](#6-folder--codebase-structure)
7. [API & Server Functions](#7-api--server-functions)
8. [User Roles & Access Control](#8-user-roles--access-control)
9. [Feature & Module Documentation](#9-feature--module-documentation)
10. [User Manual](#10-user-manual)
11. [Security Measures](#11-security-measures)
12. [Maintenance, Backup & Recovery](#12-maintenance-backup--recovery)
13. [Troubleshooting & Known Issues](#13-troubleshooting--known-issues)
14. [Change Log](#14-change-log)
15. [Developer Onboarding](#15-developer-onboarding)
16. [Future Enhancements](#16-future-enhancements)

---

## 1. System Overview & Business Objectives

**Product.** A public-facing marketing website for EDU TMT Steel, an Abuja
building-materials supplier, combined with a lightweight admin CMS for
publishing blog content and managing site branding.

**Objectives.**

- Establish an SEO-optimised presence for products (TMT rods, cement, roofing,
  BRC mesh, binding wire, marine board).
- Generate qualified enquiries via a contact page and clear product/service
  pages.
- Publish construction insights (blog) to build topical authority.
- Allow non-technical admins to edit branding (logo, favicon) and blog content
  without code changes.

**Primary users.**

- **Visitors** — browse products, services, blog, contact info.
- **Admin** — sign in at `/auth`, manage posts and site settings at `/admin`.

---

## 2. Architecture & Technology Stack

### Runtime

| Layer     | Technology                                                        |
|-----------|-------------------------------------------------------------------|
| Framework | TanStack Start v1 (React 19, file-based routing, SSR)             |
| Build     | Vite 7 with `@tailwindcss/vite` (Lightning CSS)                   |
| Styling   | Tailwind CSS v4 (CSS-first `@theme`) + shadcn/ui                  |
| Icons     | `react-icons`, `lucide-react`                                     |
| Data      | TanStack Query v5 (route-loader primed cache)                     |
| Backend   | Supabase project you configure (Postgres, Auth, Storage)           |
| Hosting   | Edge worker (Cloudflare `workerd`, `nodejs_compat`)               |

### High-level architecture

```text
Browser ──HTTPS──► Edge Worker (TanStack Start SSR)
                          │
                          ├── Static assets (Vite build)
                          ├── Server functions (createServerFn)
                          └── Supabase JS ─► Postgres / Auth / Storage
```

- **Public pages** are SSR'd for SEO. They read published data via the
  browser Supabase client with the publishable (anon) key and RLS.
- **Admin pages** live under `_authenticated/` — client-only, gated by a
  Supabase session check, and act as the signed-in admin (RLS-enforced).

---

## 3. Database Schema

All tables live in the `public` schema. Every table has RLS enabled and
explicit `GRANT`s for `anon` / `authenticated` / `service_role`.

### `site_settings` — global branding & admin identity

Singleton row (`id = 1`).

| Column        | Type    | Notes                                       |
|---------------|---------|---------------------------------------------|
| `id`          | int     | Always `1`.                                  |
| `logo_url`    | text    | Public URL of logo in `site-assets` bucket.  |
| `favicon_url` | text    | Public URL of favicon.                       |
| `admin_email` | text    | Email that receives the `admin` role on signup. |
| `updated_at`  | tstz    | Auto-maintained.                             |

**Policies.** Anyone can read; only admins can update.

### `user_roles` — role assignments

| Column | Type       | Notes                                    |
|--------|------------|------------------------------------------|
| `user_id` | uuid    | FK to `auth.users` (managed).            |
| `role`    | enum    | `app_role` — currently `admin` only.     |

Roles are checked via `public.has_role(uuid, app_role)` (SECURITY DEFINER,
stable). Never store roles on the profile table.

### `blog_categories`, `blog_tags`, `blog_post_tags`

Standard taxonomy tables. `blog_post_tags` is a many-to-many link with
`ON DELETE` cascades on both FKs.

### `blog_posts` — CMS content

| Column            | Type       | Notes                                    |
|-------------------|------------|------------------------------------------|
| `title`           | text       | Required.                                |
| `slug`            | text       | Unique in publishing surface.            |
| `excerpt`         | text       | Shown in listings.                       |
| `body`            | text       | Markdown source (rendered with `react-markdown` + GFM). |
| `cover_image`     | text       | Public URL in `site-assets`.             |
| `status`          | enum       | `draft` / `published` / `scheduled`.     |
| `published_at`    | tstz       | Publish or scheduled-publish time.       |
| `author_id`       | uuid       | `auth.users.id`.                         |
| `author_name`     | text       | Display name snapshot.                   |
| `category_id`     | uuid       | FK to `blog_categories`.                 |
| `seo_title`       | text       | Overrides `<title>` on the post page.    |
| `seo_description` | text       | Overrides meta description.              |

**Policies.**
- `anon` + `authenticated`: read rows where `status='published'` AND
  `published_at <= now()`.
- `admin`: full read + write.

**Scheduled publishing.** `public.publish_scheduled_posts()` flips
`scheduled → published` when `published_at <= now()`. Wire it to a cron/edge
schedule when scheduled posts are used.

### Storage

- Bucket **`site-assets`** (public-read) — stores logos, favicons, blog cover
  images. Public URLs are generated via `getPublicUrl` at upload time and
  stored in the corresponding row.

---

## 4. Installation & Deployment

New contributors can start with the [Developer Guide](DEVELOPER_GUIDE.md),
which explains the route tree, Supabase auth flow, admin roles, blog data flow,
and migration conventions.

### Prerequisites

- Node 22+ with npm.
- A Supabase project you own; see [SETUP.md](../SETUP.md).

### Local install

```bash
npm ci
npm run dev        # http://localhost:8080
```

Production build & preview:

```bash
npm run build
npm run preview
```

### Deployment

Deploy the server and configure your Supabase project using
[docs/DEPLOYMENT.md](DEPLOYMENT.md). Database migrations are applied with the
Supabase CLI; they are not automatically applied by the app host.

---

## 5. Environment Configuration

Copy `.env.example` to `.env` for local development. In production, configure
these values in your host's environment/secret settings.

| Variable                        | Scope   | Purpose                                    |
|---------------------------------|---------|--------------------------------------------|
| `VITE_SUPABASE_URL`             | Client  | Supabase project URL.                      |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client  | Anon/publishable API key.                  |
| `SUPABASE_URL`                  | Server  | SSR-time Supabase URL.                     |
| `SUPABASE_PUBLISHABLE_KEY`      | Server  | SSR-time publishable key.                  |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server  | Privileged operations only.                |

Never expose service-role keys to the browser. Read `process.env.*` inside
server-function handlers only, never at module scope.

---

## 6. Folder & Codebase Structure

```text
src/
  routes/                     File-based routes (TanStack Router)
    __root.tsx                Root layout: providers, head, header/footer
    index.tsx                 Home
    about.tsx  services.tsx  products.tsx  contact.tsx
    blog/
      index.tsx               Public listing (paginated)
      $slug.tsx               Public post detail
    _authenticated/           Auth-gated subtree (client-only, ssr:false)
      route.tsx               Integration-managed session gate
      admin/
        route.tsx  index.tsx  settings.tsx
        blog/index.tsx  blog/new.tsx  blog/$id.tsx
    auth.tsx                  Sign in / sign up
    sitemap[.]xml.ts          Dynamic sitemap
  components/
    site-header.tsx  site-footer.tsx  site-sections.tsx
    logo.tsx  reveal.tsx  scroll-to-top.tsx
    admin/post-editor.tsx
    ui/                       shadcn/ui primitives
  content/site.ts             Static site copy (products, services, nav)
  config/branding.ts          Fallback branding constants
  lib/
    auth-hooks.tsx            AuthProvider + useAuth
    site-settings.tsx         SiteSettingsProvider + useSiteSettings
    utils.ts                  cn() helper
  integrations/supabase/      Auto-generated Supabase clients & types
  assets/                     Bundled images (products, logo)
  styles.css                  Global CSS + Tailwind v4 tokens
supabase/
  config.toml                 Project ref
  migrations/                 Timestamped SQL migrations
docs/                         This documentation
public/                       robots.txt, static files
```

---

## 7. API & Server Functions

The app is data-driven directly from Supabase via the browser client (RLS-
protected). Server functions are reserved for privileged/auth-guarded work.

### Public reads (browser client)

| Purpose                | Table              | Filter                                    |
|------------------------|--------------------|-------------------------------------------|
| Blog listing           | `blog_posts`       | `status='published' AND published_at<=now()` |
| Blog detail            | `blog_posts`       | `slug=? AND status='published'`           |
| Site branding          | `site_settings`    | `id=1`                                    |

### Admin writes (RLS as `admin` role)

| Purpose             | Surface                                                        |
|---------------------|----------------------------------------------------------------|
| Create/edit post    | `src/components/admin/post-editor.tsx` → `blog_posts` upsert    |
| Delete post         | `src/routes/_authenticated/admin/blog/index.tsx`                |
| Update branding     | `src/routes/_authenticated/admin/settings.tsx` → `site_settings`|
| Upload asset        | Supabase Storage `site-assets` (via `storage.from(...).upload`) |

### HTTP endpoints

- `GET /sitemap.xml` — dynamic sitemap of static routes + published posts.
- `GET /robots.txt` — static, from `public/robots.txt`.

---

## 8. User Roles & Access Control

Roles are stored in `public.user_roles` and checked with `has_role()`.

| Feature                             | Anonymous | Authenticated (no role) | Admin |
|-------------------------------------|:---------:|:-----------------------:|:-----:|
| View public pages (`/`, `/about`, `/services`, `/products`, `/contact`) | ✔ | ✔ | ✔ |
| View blog listing & published posts | ✔         | ✔                       | ✔     |
| View draft/scheduled posts          | ✖         | ✖                       | ✔     |
| Access `/admin/*`                   | ✖         | ✖                       | ✔     |
| Create / edit / delete posts        | ✖         | ✖                       | ✔     |
| Update site branding / favicon      | ✖         | ✖                       | ✔     |
| Read `site_settings`                | ✔         | ✔                       | ✔     |

**Admin bootstrapping.** The `grant_admin_on_signup` trigger grants the
`admin` role to any new signup whose email matches
`site_settings.admin_email` (default `admin@domain.com`). Update
`admin_email` from the Settings page to change which address auto-becomes
admin on next signup.

---

## 9. Feature & Module Documentation

### 9.1 Public site

- **Home / About / Services / Products / Contact** — static content driven
  by `src/content/site.ts`. Sections render via `site-sections.tsx` with
  scroll-reveal animations (`components/reveal.tsx`).
- **Header** — sticky, responsive, mobile drawer. Logo pulled from
  `SiteSettingsProvider`.
- **Footer** — social links (react-icons), quick nav.
- **Scroll-to-top** — floating button, keyboard-focusable, smooth scroll.

### 9.2 Blog

- **Listing** (`/blog?page=N`) — server-paginated at 9 posts/page. URL-based
  page state (bookmarkable, SEO-friendly). Numbered pager with prev/next and
  ellipsis truncation.
- **Detail** (`/blog/:slug`) — Markdown rendered with `react-markdown` +
  `remark-gfm`. Per-post SEO (title, description, canonical, OG).

### 9.3 Admin CMS (`/admin`)

- **Dashboard** — quick links to Blog and Settings.
- **Blog list** — table of all posts (drafts, scheduled, published) with
  edit/delete actions.
- **Post editor** — title, slug, excerpt, Markdown body with live preview,
  cover-image upload, category/tags, status (draft/published/scheduled),
  publish date, SEO title & description.
- **Site settings** — upload custom logo + favicon (persisted to
  `site-assets`), change admin email.

### 9.4 Auth

- Email/password sign in and sign up at `/auth`.
- Session persisted by Supabase JS (localStorage).
- Gate: `src/routes/_authenticated/route.tsx` (`ssr:false`) redirects to
  `/auth` when unauthenticated.

---

## 10. User Manual

### Sign in as admin

1. Go to `/auth`.
2. Sign up with `admin@domain.com` (or the address configured in Settings).
3. The `admin` role is granted automatically.
4. Visit `/admin`.

### Change the logo or favicon

1. `/admin/settings`.
2. Choose an image file for **Logo** and/or **Favicon**.
3. Click **Save**. Changes are live immediately.

### Write a blog post

1. `/admin/blog` → **+ New post**.
2. Fill in title (slug auto-generates), excerpt, cover image, body (Markdown).
3. Choose status:
   - **Draft** — invisible publicly.
   - **Published** — live now.
   - **Scheduled** — set `published_at` in the future; a cron flips it live.
4. Optional: set SEO title/description, category, tags.
5. **Save**.

### Delete a post

`/admin/blog` → **Delete** on the row. Confirms before removing.

---

## 11. Security Measures

- **RLS on every table.** Public reads scoped by column filters; writes
  scoped by `has_role(auth.uid(), 'admin')`.
- **Role storage segregated** in `user_roles` (never on profiles) to prevent
  privilege-escalation via profile update.
- **Security-definer role check** (`has_role`) with `SET search_path=public`
  to avoid schema hijack.
- **No service-role key in the browser.** All privileged operations go
  through Supabase Auth Admin or SECURITY DEFINER functions.
- **Bearer-attached server calls.** Server functions using
  `requireSupabaseAuth` re-validate the caller on every request.
- **Content sanitisation.** Blog body is Markdown rendered by
  `react-markdown`; raw HTML is not enabled.
- **OAuth redirect_uri** must be same-origin public routes.
- **`.env` values** are local/private and must never be committed.

---

## 12. Maintenance, Backup & Recovery

- **Database backups.** Configure and verify backups in your Supabase project;
  availability depends on your Supabase plan.
- **Storage backups.** Back up the `site-assets` bucket separately.
- **Migrations.** All schema changes live in `supabase/migrations/` as
  timestamped SQL files. Never edit an applied migration in place — create a
  new one.
- **Rollback.** Restore from the backup/PITR options available on your
  Supabase plan; redeploy the
  matching git commit.
- **Scheduled tasks.** `publish_scheduled_posts()` should be scheduled if
  scheduled publishing is used (edge cron or `pg_cron`).

---

## 13. Troubleshooting & Known Issues

| Symptom                                     | Cause / Fix                                                    |
|---------------------------------------------|-----------------------------------------------------------------|
| "Unauthorized" on `/admin` after signup     | Email doesn't match `site_settings.admin_email`. Update it and re-signup, or manually insert into `user_roles`. |
| Logo not updating after upload              | Hard-refresh the browser; the settings provider re-fetches on mount. |
| Scheduled post never publishes              | `publish_scheduled_posts()` cron not configured — schedule it. |
| Blog page shows "No posts on this page"     | `?page=N` past the last page. Click "Back to page 1".          |
| Build fails with `Expected 3 parts in JWT`  | A server-side read is using the service-role key against a JWT-expecting endpoint. Switch to the publishable key + RLS. |

**Known limitations.**

- Single admin role (no editor/author separation yet).
- No post revisions/history.
- No draft preview link (drafts visible only in admin).

---

## 14. Change Log

### v0.3.0 — Blog pagination + docs
- Server-paginated `/blog` listing (9 per page, numbered pager).
- Added this documentation set (`docs/`).

### v0.2.0 — CMS & admin
- Supabase backend configured; `blog_posts`, `blog_categories`, `blog_tags`,
  `site_settings`, `user_roles` schemas.
- Admin dashboard, post editor with Markdown + cover upload, settings page.
- Dynamic logo/favicon.

### v0.1.0 — Marketing site
- Home, About, Services, Products, Contact routes.
- React-icons, real product photos, scroll animations, scroll-to-top.
- Sitemap, robots.

---

## 15. Developer Onboarding

### First-day checklist

1. Read [Architecture](#2-architecture--technology-stack) and
   [Folder Structure](#6-folder--codebase-structure).
2. `npm ci && npm run dev`.
3. Sign up at `/auth` with the configured admin email.
4. Skim `src/routes/__root.tsx` to see providers, head, header/footer wiring.
5. Read one route end-to-end: `src/routes/blog/index.tsx`.
6. Read `src/routes/_authenticated/route.tsx` to understand the auth gate.

### Working conventions

- **Routing** — file-based. Never edit `src/routeTree.gen.ts`.
- **Data reads** — public data via browser Supabase client with RLS;
  authenticated privileged work via `createServerFn` +
  `requireSupabaseAuth`. Never import `client.server.ts` from a component.
- **Styling** — Tailwind v4 utility classes for layout; hand-written CSS in
  `src/styles.css` for the marketing/site theme. Design tokens in `:root`
  and `@theme inline`.
- **Icons** — `react-icons` for brand/social/product accents, `lucide-react`
  for shadcn primitives.
- **Migrations** — use Supabase CLI; every new public-schema
  table needs GRANTs + RLS + policies in the same migration.

### Local test loop

- Build with `npm run build` before deploying.
- Manual smoke: `/`, `/blog`, `/blog/<slug>`, `/admin` (as admin).

---

## 16. Future Enhancements

- **Roles** — add `editor` and `author` roles; per-post ownership.
- **Post revisions** — history + restore.
- **Draft preview links** — shareable signed URLs for drafts.
- **Rich-text editor** — TipTap or similar in place of raw Markdown.
- **Newsletter capture** — integrate a mailing-list provider on the blog.
- **Structured data** — Article JSON-LD on post pages, LocalBusiness on
  home.
- **Category & tag pages** — `/blog/category/:slug`, `/blog/tag/:slug`.
- **Search** — full-text search over blog + products.
- **Analytics** — first-party analytics via edge worker.
- **Cron for scheduled posts** — wire `publish_scheduled_posts()` to a
  scheduled edge invocation.
- **Sitemap for taxonomy** — extend `sitemap.xml` once category/tag pages
  ship.

---

*Last updated: 2026-07-05.*
