export default async function editnotes({
  noteId,
  updatedTitle,
  updatedContent,
}: {
  noteId: string;
  updatedTitle: string;
  updatedContent: string;
}) {
  if (!token) {
    throw new Error("Missing user token");
  }

  const res = await fetch("/api/note", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: noteId,
      title: updatedTitle,
      description: updatedContent,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update note");
  }

  return await res.json();
}
