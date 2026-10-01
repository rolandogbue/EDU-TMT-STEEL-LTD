-- RLS policies for blog content call this helper as the authenticated role.
-- Limit it to the current user, then grant only the role needed by those policies.
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles public.app_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT _user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
        AND role = ANY(_roles)
    );
$$;

REVOKE EXECUTE ON FUNCTION public.has_any_role(uuid, public.app_role[])
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_any_role(uuid, public.app_role[])
  TO authenticated;
