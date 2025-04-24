// hooks/useSupabaseUser.js
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
export const useSupabaseUser = () => {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        console.error("User fetch error:", error);
      }
    };

    fetchUser();
  }, []);

  return user;
};
