import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
type AuthContextValue = { isAdmin: boolean };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Provides the signed-in user's administrative access to shared UI. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Keep the current user in sync with sign-in, sign-out, and token refresh events.
  useEffect(() => {
    let isMounted = true;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setUserId(session?.user.id ?? null);
    });

    void supabase.auth.getSession().then(({ data: sessionData }) => {
      if (isMounted) setUserId(sessionData.session?.user.id ?? null);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // Only users with an admin or content-manager role see the admin navigation.
  useEffect(() => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    let isCurrentUser = true;
    void supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .then(({ data: roles, error }) => {
        if (!isCurrentUser) return;
        const allowedRoles: AppRole[] = ["admin", "content_manager"];
        setIsAdmin(!error && (roles ?? []).some(({ role }) => allowedRoles.includes(role)));
      });

    return () => {
      isCurrentUser = false;
    };
  }, [userId]);

  return <AuthContext.Provider value={{ isAdmin }}>{children}</AuthContext.Provider>;
}

/** Returns auth state for components rendered beneath AuthProvider. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
