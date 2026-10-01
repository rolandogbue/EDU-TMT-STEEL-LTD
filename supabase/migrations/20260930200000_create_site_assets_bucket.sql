-- Create the public bucket used for site logos, favicons, and blog cover images.
-- Object write policies in earlier migrations restrict uploads to admin users.
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;
