"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { NoteCard } from "@/comps/notecard";
import Navbar from "@/comps/navbar";
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNotes() {
      try {
        // Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          // Handle not authenticated state
          setLoading(false);
          return;
        }

        // Fetch notes for the current user
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setNotes(data || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);
  let content;
  if (loading) {
    content = <div>Loading notes...</div>;
  } else if (error) {
    content = <div>Error loading notes: {error}</div>;
  } else if (notes.length === 0) {
    content = <div>No notes found. Create your first note!</div>;
  } else {
    content = (
      <div className="flex flex-row mt-10 gap-4 px-10 justify-start items-center w-full h-full flex-wrap">
        {notes.map((note) => (
          <NoteCard
            id={note.id}
            key={note.id}
            title={note.title}
            content={note.content}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen w-full justify-items-center bg-[#0A0A0A]">
      <Navbar />
      <div className="flex flex-row mt-10 gap-4 px-10 justify-start items-center w-full h-full">
        {content}
      </div>
    </div>
  );
}
