"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import fetchNotes from "@/function/fetchnotes";
import { NoteCard } from "@/comps/notecard";
import deletenote from "@/function/deletenote";
import Navbar from "@/comps/navbar";
import { NotesGridSkeleton } from "@/comps/skel";
export default function Dashboard() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
  });
  let content;
  if (isLoading) {
    content = <NotesGridSkeleton></NotesGridSkeleton>;
  } else if (error) {
    console.error("Failed to fetch notes:", error); // Log detailed error
    content = (
      <div>
        Oops! Something went wrong while loading notes. Please try again later.
      </div>
    );
  } else if (data.length === 0) {
    content = <div>No notes found. Create your first note!</div>;
  } else {
    content = (
      <div className="flex flex-row mt-10 gap-4 px-10 justify-start items-center w-full h-full flex-wrap">
        {data.map((note) => (
          <NoteCard
            time={note.created_at}
            id={note.id}
            key={note.id}
            title={note.title}
            content={note.content}
          />
        ))}
      </div>
    );
  }
  console.log();
  return (
    <div className="flex flex-col min-h-screen w-full justify-items-center bg-[#0A0A0A]">
      <Navbar />
      <div className="flex flex-row mt-10 gap-4 px-10 justify-start items-center w-full h-full">
        {content}
      </div>
    </div>
  );
}
