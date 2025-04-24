"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { signout } from "@/lib/auth-action";

import { createClient } from "@/lib/supabase/client";
const LoginButton = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);
  if (user) {
    return (
      <Button
        className="ml-2 px-6 py-2 rounded-md bg-[#f8f8f6] border border-[#e1e1de] text-[#222a28] font-medium hover:bg-[#f3f3f0] hover:text-black"
        onClick={() => {
          signout();
          setUser(null);
        }}
      >
        Log out
      </Button>
    );
  }
  return (
    <Button
      className="ml-2 px-6 py-2 rounded-md bg-[#f8f8f6] border border-[#e1e1de] text-[#222a28] font-medium hover:bg-[#f3f3f0] hover:text-black"
      variant="outline"
      onClick={() => {
        router.push("/login");
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
