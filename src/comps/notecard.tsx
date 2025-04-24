"use client";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { Edit, Trash2, MoreHorizontal, Save, X } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function NoteCard({
  id,
  title,
  time,
  content,
  onNoteUpdated,
  onDelete,
}: NoteCardProps) {
  const supabase = createClient();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const timeAgo = formatDistanceToNow(time, { addSuffix: true });

  useEffect(() => {
    (async () => {
      const session = (await supabase.auth.getSession()).data.session;
      if (session) setToken(session.access_token);
    })();
  }, []);

  // Update note mutation using React Query
  const updateNoteMutation = useMutation({
    mutationFn: async ({
      noteId,
      updatedTitle,
      updatedContent,
    }: {
      noteId: string;
      updatedTitle: string;
      updatedContent: string;
    }) => {
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
    },
    onSuccess: () => {
      toast.success("Note updated successfully!");
      if (onNoteUpdated) onNoteUpdated();

      // Invalidate and refetch notes query
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      setIsEditing(false);
    },
    onError: (error) => {
      console.error("API call failed:", error);
      toast.error(`Failed to update note: ${error.message}`);
    },
  });

  // Delete note mutation using React Query
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("Missing user token");
      }

      const res = await fetch(`/api/note?id=${id}`, {
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
    },
    onSuccess: () => {
      toast.success("Note deleted successfully");
      if (onDelete) onDelete(id);

      // Invalidate and refetch notes query
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("API call failed:", error);
      toast.error(`Failed to delete note: ${error.message}`);
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTitle(title);
    setEditedContent(content);
  };

  const handleSave = () => {
    if (!editedTitle.trim() || !editedContent.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    updateNoteMutation.mutate({
      noteId: id,
      updatedTitle: editedTitle,
      updatedContent: editedContent,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(title);
    setEditedContent(content);
  };

  const handleDelete = () => {
    deleteNoteMutation.mutate(id);
  };

  if (isEditing) {
    return (
      <Card className="w-[300px] h-[300px] overflow-hidden border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-black shadow-md transition-all duration-300 hover:border-zinc-700 hover:shadow-lg dark:shadow-black/10">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="w-full">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="font-semibold text-lg bg-zinc-800/50 border-zinc-700 text-zinc-100 focus-visible:ring-violet-500"
              placeholder="Note title"
            />
            <p className="text-xs text-zinc-400 mt-1">{timeAgo}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[120px] bg-zinc-800/50 border-zinc-700 text-zinc-300 focus-visible:ring-violet-500"
            placeholder="Note content"
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
            disabled={updateNoteMutation.isPending}
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-violet-600 text-white hover:bg-violet-700"
            disabled={updateNoteMutation.isPending}
          >
            <Save className="mr-1 h-4 w-4" />
            {updateNoteMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="w-[300px] h-[300px]">
      <Card className="h-full overflow-hidden border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-black shadow-md transition-all duration-300 hover:border-zinc-700 hover:shadow-lg dark:shadow-black/10">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg tracking-tight text-zinc-100">
              {title}
            </h3>
            <p className="text-xs text-zinc-400">{timeAgo}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-zinc-100"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-zinc-900 border border-zinc-800"
            >
              <DropdownMenuItem
                onClick={handleEditClick}
                className="text-zinc-200 focus:text-white focus:bg-zinc-800"
                disabled={
                  updateNoteMutation.isPending || deleteNoteMutation.isPending
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 focus:text-red-300 focus:bg-zinc-800"
                onClick={handleDelete}
                disabled={
                  updateNoteMutation.isPending || deleteNoteMutation.isPending
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteNoteMutation.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p className="text-sm h-full whitespace-pre-line text-zinc-300">
            {content}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
