import { notesIndex } from "@/lib/pindecode";
import { supabase } from "@/lib/supabase";
import { getEmbedding } from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/supabase/server";
import { cookies } from "next/headers";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description } = body;

    // Get user from access token
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    const embedding = await getEmbeddingForNote(title, description);

    // Ensure embedding dimensions match Pinecone index dimensions
    const expectedDimensions = 1024; // Replace with your index's dimension
    if (embedding.length !== expectedDimensions) {
      return NextResponse.json(
        {
          error: `Embedding dimension mismatch: expected ${expectedDimensions}, got ${embedding.length}`,
        },
        { status: 400 }
      );
    }

    const newNote = {
      user_id: user.id,
      title: title || "Untitled Note",
      content: description,
    };

    const { data: noteData, error } = await supabase
      .from("notes")
      .insert(newNote)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.log(noteData);

    await notesIndex.upsert([
      {
        id: noteData[0].id,
        values: embedding,
        metadata: { userId: user.id },
      },
    ]);

    return NextResponse.json({ note: noteData[0] }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function getEmbeddingForNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + (content || ""));
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, description } = body;

    if (!id || !title || !description) {
      return NextResponse.json(
        { error: "Missing note ID, title, or description" },
        { status: 400 }
      );
    }
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }

    // Update the note in Supabase
    const { data: updatedNote, error: updateError } = await supabase
      .from("notes")
      .update({ title, content: description })
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (updateError || !updatedNote?.[0]) {
      return NextResponse.json(
        { error: updateError?.message || "Note not found or not authorized" },
        { status: 400 }
      );
    }

    // Update embedding in Pinecone
    const embedding = await getEmbeddingForNote(title, description);
    const expectedDimensions = 1024;
    if (embedding.length !== expectedDimensions) {
      return NextResponse.json(
        {
          error: `Embedding dimension mismatch: expected ${expectedDimensions}, got ${embedding.length}`,
        },
        { status: 400 }
      );
    }

    await notesIndex.upsert([
      {
        id,
        values: embedding,
        metadata: { userId: user.id },
      },
    ]);

    return NextResponse.json({ note: updatedNote[0] }, { status: 200 });
  } catch (error: any) {
    console.error("Update note error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
// For App Router: /app/api/note/route.ts
// For Pages Router: /pages/api/note.js
import { NextApiRequest, NextApiResponse } from "next";
// /app/api/note/route.ts

export async function DELETE(request: NextRequest) {
  try {
    // Extract and verify the auth token from headers
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify token and extract user information
    let userId;
    try {
      // Using Supabase to verify the token and get user info
      const session = await supabase.auth.getUser(token);
      userId = session?.data?.user?.id;

      if (!userId) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }
    } catch (tokenError) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get note ID from query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Optional: Check if the note belongs to the authenticated user
    const { data: noteData, error: fetchError } = await supabase
      .from("notes")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to verify note ownership" },
        { status: 500 }
      );
    }

    if (!noteData) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (noteData.user_id !== userId) {
      return NextResponse.json(
        { error: "You do not have permission to delete this note" },
        { status: 403 }
      );
    }

    // Delete the note
    const { error: deleteError } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting note:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete note" },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      { success: true, message: "Note deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
