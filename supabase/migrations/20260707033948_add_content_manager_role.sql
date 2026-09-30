-- Extend the enum so trusted editors can manage blog content without admin settings access.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_manager';
