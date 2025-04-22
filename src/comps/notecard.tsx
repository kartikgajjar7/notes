import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase as s } from "@/lib/supabase"; // Assuming supabase client is exported as 's'
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
// Function to update a specific note in the Supabase database
async function updateNote(
  noteId: string,
  updatedTitle: string,
  updatedContent: string
) {
  try {
    const res = await fetch("/api/note", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        noteId,
        title: updatedTitle,
        content: updatedContent,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Error updating note via API:", result.error);
      throw new Error(result.error || "Failed to update note");
    }
    toast.success("Note updated successfully!");
    return result.data;
  } catch (err) {
    console.error("API call failed:", err);
    throw err;
  }
}

// Interface for NoteCard props
interface NoteCardProps {
  id: string; // Unique identifier for the note
  title: string;
  content: string;
  onNoteUpdated?: () => void; // Optional callback after successful update
}

export function NoteCard({ id, title, content, onNoteUpdated }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  // State for edited values, initialized with props
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle submitting the edited note
  const handleSubmit = async () => {
    // Prevent submission if already submitting or if content hasn't changed
    if (!id || typeof id !== "string") {
      console.error("Cannot update note: Invalid or missing ID received.", id);
      return; // Prevent the API call
    }

    // Check if the title or content is empty
    if (!editedTitle.trim() || !editedContent.trim()) {
      toast.error("Title and content cannot be empty"); // Show a toast message
      return; // Prevent submission if empty
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await updateNote(id, editedTitle, editedContent);
      setIsEditing(false); // Exit edit mode on success

      if (onNoteUpdated) {
        onNoteUpdated();
      }
    } catch (error) {
      console.error("Failed to update note:", error);
      // Optionally, you can show an error message to the user (e.g., using a toast notification)
    } finally {
      setIsSubmitting(false); // Ensure button is re-enabled
    }
  };

  // Handle canceling the edit
  const handleCancel = () => {
    // *** FIX: Reset state to original props before exiting edit mode ***
    setEditedTitle(title);
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    // Consider making dimensions more flexible if needed
    <div className="w-[300px] h-[300px]">
      {/* Ensure Card fills the container */}
      <Card className="border bg-[#0A0A0A] border-border h-full text-card-foreground shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
        {!isEditing ? (
          <>
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-lg font-medium break-words">
                {" "}
                {/* Allow title to wrap */}
                {title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 flex-shrink-0" // Prevent button shrinking
              >
                ✏️
              </Button>
            </CardHeader>
            {/* Make content area flexible */}
            <CardContent className="flex-grow overflow-y-auto pt-0">
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {content}
              </p>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="pb-2">
              <label
                htmlFor="noteTitle"
                className="text-sm text-neutral-400 mb-1"
              >
                Title
              </label>
              <Input
                id="noteTitle"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Note Title"
                className="bg-[#121212] border-neutral-800"
              />
            </CardHeader>
            {/* Make content area flexible, contain textarea and buttons */}
            <CardContent className="flex-grow flex flex-col gap-4 pt-0">
              <div className="flex-grow flex flex-col">
                <label
                  htmlFor="noteContent"
                  className="text-sm text-neutral-400 mb-1"
                >
                  Content
                </label>
                <Textarea
                  id="noteContent"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Note Content"
                  className="flex-grow bg-[#121212] border-neutral-800 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
