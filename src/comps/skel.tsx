import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function NotesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 w-full sm:grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Note 1 - Untitled Note */}
      <div className="rounded-xl bg-zinc-900 h-[300px] w-[300px] p-4 border border-zinc-800 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-28 bg-zinc-800" />
          <MoreHorizontal className="h-5 w-5 text-zinc-500" />
        </div>
        <Skeleton className="h-4 w-36 bg-zinc-800 mb-4" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
        </div>
      </div>

      {/* Note 2 - Shopping List */}
      <div className="rounded-xl bg-zinc-900 h-[300px] w-[300px] p-4 border border-zinc-800 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-28 bg-zinc-800" />
          <MoreHorizontal className="h-5 w-5 text-zinc-500" />
        </div>
        <Skeleton className="h-4 w-36 bg-zinc-800 mb-4" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
        </div>
      </div>

      {/* Note 3 - Work Tasks */}
      <div className="rounded-xl bg-zinc-900 h-[300px] w-[300px] p-4 border border-zinc-800 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-40 bg-zinc-800" />
          <MoreHorizontal className="h-5 w-5 text-zinc-500" />
        </div>
        <Skeleton className="h-4 w-36 bg-zinc-800 mb-4" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
        </div>
      </div>

      {/* Note 4 - Task on Sunday */}
      <div className="rounded-xl bg-zinc-900 h-[300px] w-[300px] p-4 border border-zinc-800 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-32 bg-zinc-800" />
          <MoreHorizontal className="h-5 w-5 text-zinc-500" />
        </div>
        <Skeleton className="h-4 w-36 bg-zinc-800 mb-4" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-4 w-full bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
        </div>
      </div>

      {/* Note 5 - Favorite Movies */}
      <div className="rounded-xl bg-zinc-900 h-[300px] w-[300px] p-4 border border-zinc-800 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-6 w-32 bg-zinc-800" />
          <MoreHorizontal className="h-5 w-5 text-zinc-500" />
        </div>
        <Skeleton className="h-4 w-36 bg-zinc-800 mb-4" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48 bg-zinc-800" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full bg-zinc-800" />
            <Skeleton className="h-4 w-full bg-zinc-800" />
            <Skeleton className="h-4 w-full bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
