const deletenote = async (noteId: string, token: string) => {
  if (!token) {
    throw new Error("Missing user token");
  }

  const res = await fetch(`/api/note?id=${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete note");
  }

  return await res.json();
};
export default deletenote;
