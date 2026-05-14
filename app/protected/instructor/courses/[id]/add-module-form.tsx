"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createModule } from "./actions";
import { PlusCircle, X } from "lucide-react";

export function AddModuleForm({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await createModule(courseId, title.trim());
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setTitle("");
    setOpen(false);
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PlusCircle size={14} />
        Add Module
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Module title"
        required
        className="max-w-xs"
      />
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "Adding…" : "Add"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => { setOpen(false); setError(null); }}
      >
        <X size={14} />
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
