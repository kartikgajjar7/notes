import { NextRequest, NextResponse } from "next/server";
import { notesIndex } from "@/lib/pindecode";
import { supabase } from "@/lib/supabase";
import { getEmbedding } from "@/lib/openai";

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
