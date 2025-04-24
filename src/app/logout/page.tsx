"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  router.push("/");
  return <div>You have logged out... redirecting in a sec.</div>;
};

export default LogoutPage;
