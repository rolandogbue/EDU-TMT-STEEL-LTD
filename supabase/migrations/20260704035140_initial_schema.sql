
-- Application roles are stored separately from Auth users so RLS can grant
-- different capabilities without putting authorization in client-controlled data.
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- SECURITY DEFINER lets policy checks read role rows without recursive RLS.
-- Keep a fixed search_path so object names cannot be shadowed by another schema.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role) $$;

-- Shared trigger helper keeps updated_at consistent on mutable records.
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- One-row table for public branding and the email allowed to bootstrap the first admin.
CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1,
  admin_email text NOT NULL DEFAULT 'admin@domain.com',
  logo_url text,
  favicon_url text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.site_settings (id, admin_email) VALUES (1, 'admin@domain.com');

-- First-admin bootstrap: when the configured email signs up, grant the admin role.
-- Later team members are assigned roles by a protected server function instead.
CREATE OR REPLACE FUNCTION public.grant_admin_on_signup() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _admin_email text;
BEGIN
  SELECT admin_email INTO _admin_email FROM public.site_settings WHERE id=1;
  IF lower(NEW.email) = lower(_admin_email) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.grant_admin_on_signup();

-- Keep the bootstrap email current when an existing admin changes their Auth email.
CREATE OR REPLACE FUNCTION public.sync_admin_email_on_change() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email AND public.has_role(NEW.id, 'admin') THEN
    UPDATE public.site_settings SET admin_email = NEW.email WHERE id = 1;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_email_change_sync
AFTER UPDATE OF email ON auth.users FOR EACH ROW EXECUTE FUNCTION public.sync_admin_email_on_change();

-- Blog taxonomy: categories and tags are reusable; posts reference a category.
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_categories TO service_role;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
-- Public visitors can read taxonomy; role checks gate all mutations.
CREATE POLICY "Anyone views categories" ON public.blog_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.blog_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_tags TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_tags TO authenticated;
GRANT ALL ON public.blog_tags TO service_role;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
-- Tags are public metadata, but only authorized content staff can maintain them.
CREATE POLICY "Anyone views tags" ON public.blog_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage tags" ON public.blog_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TYPE public.post_status AS ENUM ('draft','published','scheduled');

-- Store publication and SEO metadata with the Markdown body. Public RLS below
-- deliberately exposes only posts that are published and whose date has arrived.
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  body text NOT NULL DEFAULT '',
  cover_image text,
  status post_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX blog_posts_status_idx ON public.blog_posts(status, published_at DESC);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
-- Anonymous reads are limited to already-published posts; admins can also see drafts.
CREATE POLICY "Anyone views published posts" ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now());
CREATE POLICY "Admins view all posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Join table supports multiple tags per post and multiple posts per tag.
CREATE TABLE public.blog_post_tags (
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
GRANT SELECT ON public.blog_post_tags TO anon, authenticated;
GRANT INSERT, DELETE ON public.blog_post_tags TO authenticated;
GRANT ALL ON public.blog_post_tags TO service_role;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
-- Tag links can be read publicly; management is restricted to authorized editors.
CREATE POLICY "Anyone views post_tags" ON public.blog_post_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage post_tags" ON public.blog_post_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- A scheduled job can call this function to make due posts public automatically.
CREATE OR REPLACE FUNCTION public.publish_scheduled_posts() RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.blog_posts SET status='published' WHERE status='scheduled' AND published_at <= now();
$$;
