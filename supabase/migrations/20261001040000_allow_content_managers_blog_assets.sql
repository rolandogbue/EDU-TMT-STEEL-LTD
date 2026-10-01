-- Content managers may maintain blog covers, but cannot alter branding assets.
CREATE POLICY "Content managers upload blog assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'site-assets'
    AND (storage.foldername(name))[1] = 'blog'
    AND public.has_any_role(auth.uid(), ARRAY['content_manager']::public.app_role[])
  );

CREATE POLICY "Content managers update blog assets" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'site-assets'
    AND (storage.foldername(name))[1] = 'blog'
    AND public.has_any_role(auth.uid(), ARRAY['content_manager']::public.app_role[])
  )
  WITH CHECK (
    bucket_id = 'site-assets'
    AND (storage.foldername(name))[1] = 'blog'
    AND public.has_any_role(auth.uid(), ARRAY['content_manager']::public.app_role[])
  );

CREATE POLICY "Content managers delete blog assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'site-assets'
    AND (storage.foldername(name))[1] = 'blog'
    AND public.has_any_role(auth.uid(), ARRAY['content_manager']::public.app_role[])
  );
