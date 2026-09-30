
-- Public assets can be read without signing in; only admins can change bucket contents.
-- The `site-assets` bucket itself must be created in Supabase Storage separately.
CREATE POLICY "Public read site-assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'site-assets');
CREATE POLICY "Admins upload site-assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update site-assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(),'admin')) WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete site-assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(),'admin'));
