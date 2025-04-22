// hooks/useSupabaseUser.js
"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const useSupabaseUser = () => {
  const [user, setUser] = useState(null);

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
