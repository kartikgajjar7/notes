import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw Error("OPENAI_API_KEY is not set");
}

const openaia = new OpenAI({ apiKey });

export default openaia;

export async function getEmbedding(text: string) {
  const response = await openaia.embeddings.create({
    model: "text-embedding-3-small",
    dimensions: 1024,
    input: text,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) throw Error("Error generating embedding.");

  console.log(embedding);

  return embedding;
}
