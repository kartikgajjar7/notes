import { openai as os } from "@ai-sdk/openai";
import { streamText, type Message } from "ai";
import openaia from "@/lib/openai";
import { getEmbedding } from "@/lib/openai";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { openai } from "@ai-sdk/openai";
import { notesIndex } from "@/lib/pindecode";
import { supabase } from "@/lib/supabase";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("hello");
  try {
    const { messages, userId }: { messages: Message[]; userId: string } =
      await req.json();
    const messagesTruncated = messages.slice(-6);
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n")
    );

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relevantNotes = await supabase
      .from("notes")
      .select("*")
      .in(
        "id",
        vectorQueryResponse.matches.map((match) => match.id)
      );

    console.log("Relevant notes found: ", relevantNotes);

    const systemMessage = {
      role: "system",
      content:
        "You are an intelligent note-taking app. You answer the user's question based on their existing notes. " +
        "The relevant notes for this query are:\n" +
        relevantNotes.data
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    const response = await openaia.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });
    const result = streamText({
      model: openai("gpt-4o"),
      messages: [systemMessage, ...messagesTruncated],
      system:
        "You are a helpful AI assistant. Provide clear, concise, and accurate responses.",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
