import { supabase } from "@/lib/supabase";
import { createClient } from "@/lib/supabase/client";
export default async function fetchNotes() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unable to fetch user");
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  console.log("returning data from fetchnotes", data);
  return data;
}
