import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextValue = { isAdmin: boolean };

const AuthContext = createContext<AuthContextValue>({ isAdmin: false });

/** Keeps the global navigation in sync with the signed-in user's admin role. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    // Roles are read from Supabase under the user's session/RLS policies.
    const refreshRole = async (user: User | null) => {
      if (!user) {
        if (active) setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (active) setIsAdmin((data ?? []).some((row) => row.role === "admin"));
    };

    // Load the persisted session once, then listen for login/logout/token changes.
    void supabase.auth.getUser().then(({ data }) => refreshRole(data.user));

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      // Let Supabase finish its auth callback before making another client request.
      setTimeout(() => void refreshRole(session?.user ?? null), 0);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={{ isAdmin }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  // The default false value also lets error/not-found shells render outside the
  // normal provider tree without exposing admin navigation.
  return useContext(AuthContext);
}
