import { supabase } from "@/lib/supabase";
export const signIn = async (authData: { email: string; password: string }) => {
  const { email, password } = authData;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};
