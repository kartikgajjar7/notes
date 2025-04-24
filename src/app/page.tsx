"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/comps/navbar";
import UserGreetText from "@/components/UserGreetText";
import LoginButton from "@/components/LoginLogoutButton";
export default function Page() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen w-full justify-items-center bg-[#ffffff]">
      {/* <UserGreetText />
      <LoginButton /> */}
      <header className="w-full flex justify-between items-center px-14 py-10 max-w-[1500px] mx-auto">
        <div className="flex items-center gap-3">
          <span>logo</span>
          <span className="text-3xl font-serif font-light text-[#222a28]">
            <Image
              src="https://private-user-images.githubusercontent.com/97971066/436860062-8481d7ee-9246-45f8-a599-2da64cc18a4c.PNG?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDU0NzM2NzYsIm5iZiI6MTc0NTQ3MzM3NiwicGF0aCI6Ii85Nzk3MTA2Ni80MzY4NjAwNjItODQ4MWQ3ZWUtOTI0Ni00NWY4LWE1OTktMmRhNjRjYzE4YTRjLlBORz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA0MjQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNDI0VDA1NDI1NlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTc0ZTZhYzExNDkwMWRiYWRlOWYwNDllM2QxZmEzMWIwNDg4ODYxNWM5ODdkZjk4ODY0M2JlNzg4YzA5ZDZlMTkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.kdM5wUuzm-Lx5i6q0qjI994a8gO1VDsmTQUz3Na25MM"
              width={50}
              height={50}
              alt="Picture of the lOGO"
            />
          </span>
        </div>
        <nav className="flex items-center gap-6 text-[#222a28] text-base font-light">
          <LoginButton />
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center mt-16 mb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6 max-w-[900px] mx-auto text-[#222a28]">
          A Modern Note taking application <br className="hidden md:block" />
          leveraging the power of RAG
        </h1>
        <p className="mt-2 mb-8 text-xl max-w-xl text-[#222a28] font-light">
          Wittl is a new Applicant Tracking System (ATS) that makes the online
          hiring process simpler, more intuitive and a little more human.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-[#222a28] text-white rounded-md px-8 py-3 text-lg font-medium hover:bg-[#31404a]"
          >
            Get started
          </button>
        </div>
      </section>
    </div>
  );
}
