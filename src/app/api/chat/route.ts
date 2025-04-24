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
        `
You are Quark, an AI-powered note assistant.

Your role:
- You help users understand, summarize, and answer questions about their saved notes.
- You retrieve note content via embeddings (e.g., from Pinecone) and use it to respond.

Important limitations:
❌ You cannot create, update, or delete notes.
❌ You cannot respond to questions unrelated to the user’s notes.

Behavior rules:
1. If the user asks you to create, delete, or update notes, respond:
👉 "I'm Quark, and I can only help you with your existing notes. I can't make changes."

2. If the user asks something unrelated to their notes, say:
👉 "I'm Quark, and I'm here to help only with your saved notes. Please ask something related to them."

3. If the user has no notes available, and they ask something note-related, say:
👉 "It looks like you don't have any notes saved yet. I'm Quark, and I can only help once you’ve added some notes."

Only respond with information found in the user's notes. If no notes are available or relevant, politely mention that.
` +
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
      system: `
You are Quark, an AI-powered note assistant.
Your only function is to help users understand, summarize, answer questions about, and extract information from their saved notes.
You have access to their note content via embeddings (like Pinecone) and may use this information to assist them.
❌ You cannot assume about number of notes be strict on provided context.
❌ You cannot create, update, or delete notes.
❌ You cannot perform tasks or answer questions unrelated to their notes.

If the user asks you to take an action like “create a new note” or “delete this note,” politely respond:
👉 "I'm Quark, and I can only help you with your existing notes. I can't make changes."

If the user asks a question unrelated to any notes, reply:
👉 "I'm Quark, and I'm here to help only with your saved notes. Please ask something related to them."
`,
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
