
-- Reusable role check lets policies grant access to either admins or content managers.
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles app_role[])
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role = ANY(_roles)) $$;

REVOKE EXECUTE ON FUNCTION public.has_any_role(uuid, app_role[]) FROM PUBLIC, anon, authenticated;

-- Replace admin-only blog policies with a shared content-staff policy.
-- Admin-only control of user_roles and site_settings remains unchanged.
DROP POLICY IF EXISTS "Admins manage posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins view all posts" ON public.blog_posts;
CREATE POLICY "Content staff manage posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','content_manager']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','content_manager']::app_role[]));
CREATE POLICY "Content staff view all posts" ON public.blog_posts
  FOR SELECT TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','content_manager']::app_role[]));

DROP POLICY IF EXISTS "Admins manage categories" ON public.blog_categories;
CREATE POLICY "Content staff manage categories" ON public.blog_categories
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','content_manager']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','content_manager']::app_role[]));

DROP POLICY IF EXISTS "Admins manage tags" ON public.blog_tags;
CREATE POLICY "Content staff manage tags" ON public.blog_tags
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','content_manager']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','content_manager']::app_role[]));

DROP POLICY IF EXISTS "Admins manage post_tags" ON public.blog_post_tags;
CREATE POLICY "Content staff manage post_tags" ON public.blog_post_tags
  FOR ALL TO authenticated
  USING (public.has_any_role(auth.uid(), ARRAY['admin','content_manager']::app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['admin','content_manager']::app_role[]));

-- Only admins can assign or revoke roles, preventing content managers from
-- escalating their own access.
CREATE POLICY "Admins view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert roles" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update roles" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Store generated responsive image URLs alongside the post's largest cover URL.
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS cover_image_srcset jsonb;
