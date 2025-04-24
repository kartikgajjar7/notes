"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/comps/navbar";
import UserGreetText from "@/components/UserGreetText";
import LoginButton from "@/components/LoginLogoutButton";

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen w-full justify-items-center bg-black text-white">
      {/* <UserGreetText />
      <LoginButton /> */}
      <header className="w-full flex justify-between items-center px-6 py-6 md:px-14 md:py-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-medium text-white"></span>
        </div>
        <nav className="flex items-center gap-6 text-gray-400 text-sm font-medium">
          <LoginButton />
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center mt-20 md:mt-32 mb-20 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto text-white">
          A Modern Note taking application <br className="hidden md:block" />
          leveraging the power of RAG
        </h1>
        <p className="mt-4 mb-10 text-lg md:text-xl max-w-xl text-gray-400">
          Elevate your note-taking with AI-powered insights and seamless
          Creation
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-white text-black rounded-md px-8 py-3 text-sm font-medium hover:bg-gray-200 transition-colors duration-200 w-full md:w-auto"
          >
            Get started
          </button>
        </div>
      </section>
    </div>
  );
}
