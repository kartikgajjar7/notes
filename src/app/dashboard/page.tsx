import React from "react";
import { supabase } from "@/lib/supabase";

export default async function Page() {
  const { data, error } = await supabase.auth.getUser();

  return (
    <div>
      <h2>Dashboard</h2>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
