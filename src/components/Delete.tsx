"use client";

import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteButton({ stackId }: { stackId: number }) {
    const router = useRouter();
  return (
    <div className="">
        <button
          className="p-1 rounded bg-red-500"
          onClick={async () => {
            await fetch(`/api/stack`, { method: "DELETE", body: JSON.stringify({ id: stackId }) });
            // Reload the page after the delete operation
            router.refresh()
          }}
        >
          <Trash />
        </button>
    </div>
  );

}

export function EditButton({ stackId }: { stackId: number }) {
  const router = useRouter();
  return (
    <div className="">
        <button className="p-1 rounded bg-blue-500" onClick={async () => router.push(`/edit/${stackId}`)}>
          <Pencil />
        </button>
    </div>
  );
}