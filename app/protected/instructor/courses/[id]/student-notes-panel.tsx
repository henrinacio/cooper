"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  StickyNote,
  Pin,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  History,
  ExternalLink,
} from "lucide-react"
import {
  createStudentNote,
  updateStudentNote,
  deleteStudentNote,
  getStudentNoteHistory,
} from "./actions"
import { toast } from "sonner"
import type { StudentNote } from "@/lib/supabase/types"
import { useLocale } from "@/components/locale-provider"
import { translations } from "./student-notes-panel.i18n"
import { cn } from "@/lib/utils"
import Link from "next/link"

const PRESET_TAGS = ["academic", "attendance", "behavior", "personal", "milestone"]

interface NoteFormState {
  content: string;
  tags: string[];
  pinned: boolean;
}

function sortNotes(notes: StudentNote[]): StudentNote[] {
  return [...notes].sort((noteA, noteB) => {
    if (noteA.pinned !== noteB.pinned) {
      return noteA.pinned ? -1 : 1
    }
    return new Date(noteB.created_at).getTime() - new Date(noteA.created_at).getTime()
  })
}

function emptyForm(): NoteFormState {
  return { content: "", tags: [], pinned: false }
}

function formFromNote(note: StudentNote): NoteFormState {
  return {
    content: note.content,
    tags: note.tags,
    pinned: note.pinned,
  }
}

interface NoteFormProps {
  form: NoteFormState;
  onChange: (updated: NoteFormState) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  t: (typeof translations)[keyof typeof translations];
}

function NoteForm({ form, onChange, onSave, onCancel, saving, t }: NoteFormProps) {
  function toggleTag(tag: string) {
    const hasTag = form.tags.includes(tag)
    const updatedTags = hasTag ? form.tags.filter((existingTag) => existingTag !== tag) : [...form.tags, tag]
    onChange({ ...form, tags: updatedTags })
  }

  return (
    <div className="flex flex-col gap-3 p-3 border rounded-lg bg-muted/30">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">{t.content}</label>
        <Textarea
          value={form.content}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ ...form, content: event.target.value })}
          rows={3}
          className="text-sm resize-none"
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">{t.tags}</label>
        <div className="flex flex-wrap gap-1">
          {PRESET_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border transition-colors",
                form.tags.includes(tag)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.pinned}
            onChange={(event) => onChange({ ...form, pinned: event.target.checked })}
            className="rounded"
          />
          <Pin size={12} />
          {t.pinned}
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
          {t.cancel}
        </Button>
        <Button size="sm" onClick={onSave} disabled={saving || !form.content.trim()}>
          {saving ? "…" : t.saveNote}
        </Button>
      </div>
    </div>
  )
}

interface Props {
  courseId: string;
  studentId: string;
  studentName: string | null;
  initialNotes: StudentNote[];
}

export function StudentNotesPanel({ courseId, studentId, studentName, initialNotes }: Props) {
  const locale = useLocale()
  const translationSet = translations[locale]

  const [notes, setNotes] = useState<StudentNote[]>(() => sortNotes(initialNotes))
  const [expanded, setExpanded] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState<NoteFormState>(emptyForm)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<NoteFormState>(emptyForm)
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)
  const [historyDialogNote, setHistoryDialogNote] = useState<StudentNote | null>(null)
  const [historyEntries, setHistoryEntries] = useState<{ id: string; content: string; edited_at: string }[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleAddSave() {
    startTransition(async () => {
      const result = await createStudentNote(
        courseId,
        studentId,
        addForm.content.trim(),
        addForm.tags,
        addForm.pinned,
      )

      if (result.error) {
        toast.error(result.error)
        return
      }

      const now = new Date().toISOString()
      const newNote: StudentNote = {
        id: result.id!,
        instructor_id: "",
        student_id: studentId,
        course_id: courseId,
        content: addForm.content.trim(),
        tags: addForm.tags,
        pinned: addForm.pinned,
        session_id: null,
        created_at: now,
        updated_at: now,
      }

      setNotes((previousNotes) => sortNotes([newNote, ...previousNotes]))
      setAddForm(emptyForm())
      setShowAddForm(false)
      toast.success(translationSet.noteAdded)
    })
  }

  async function handleEditSave(noteId: string) {
    startTransition(async () => {
      const result = await updateStudentNote(
        courseId,
        noteId,
        studentId,
        editForm.content.trim(),
        editForm.tags,
        editForm.pinned,
      )

      if (result.error) {
        toast.error(result.error)
        return
      }

      setNotes((previousNotes) =>
        sortNotes(
          previousNotes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  content: editForm.content.trim(),
                  tags: editForm.tags,
                  pinned: editForm.pinned,
                  updated_at: new Date().toISOString(),
                }
              : note
          )
        )
      )

      setEditingNoteId(null)
      toast.success(translationSet.noteUpdated)
    })
  }

  async function handleDelete(noteId: string) {
    startTransition(async () => {
      const result = await deleteStudentNote(courseId, noteId, studentId)

      if (result.error) {
        toast.error(result.error)
        return
      }

      setNotes((previousNotes) => previousNotes.filter((note) => note.id !== noteId))
      setDeletingNoteId(null)
      toast.success(translationSet.noteDeleted)
    })
  }

  async function handleOpenHistory(note: StudentNote) {
    setHistoryDialogNote(note)
    setHistoryLoading(true)
    setHistoryEntries([])

    const result = await getStudentNoteHistory(note.id)

    setHistoryLoading(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    setHistoryEntries(result.history ?? [])
  }

  function startEdit(note: StudentNote) {
    setEditingNoteId(note.id)
    setEditForm(formFromNote(note))
    setShowAddForm(false)
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors self-start py-1"
      >
        <StickyNote size={13} />
        {translationSet.notes}
        {notes.length > 0 && (
          <span className="font-medium text-foreground">({notes.length})</span>
        )}
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {expanded && (
        <div className="flex flex-col gap-2 mt-1 ml-1">
          {notes.length === 0 && !showAddForm && (
            <p className="text-xs text-muted-foreground">{translationSet.noNotes}</p>
          )}

          {notes.map((note) => (
            <div key={note.id} className="flex flex-col gap-1">
              {editingNoteId === note.id ? (
                <NoteForm
                  form={editForm}
                  onChange={setEditForm}
                  onSave={() => handleEditSave(note.id)}
                  onCancel={() => setEditingNoteId(null)}
                  saving={isPending}
                  t={translationSet}
                />
              ) : (
                <div className={cn(
                  "flex flex-col gap-1.5 p-2.5 rounded-lg border text-xs",
                  note.pinned && "border-primary/40 bg-primary/5"
                )}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">{note.content}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => startEdit(note)}
                      >
                        <Pencil size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeletingNoteId(note.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleOpenHistory(note)}
                      >
                        <History size={12} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1">
                    {note.pinned && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1 gap-0.5 border-primary/50 text-primary">
                        <Pin size={9} />
                        {translationSet.pinnedLabel}
                      </Badge>
                    )}
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1">
                        {tag}
                      </Badge>
                    ))}
                    <span className="text-muted-foreground text-[10px] ml-auto">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {showAddForm ? (
            <NoteForm
              form={addForm}
              onChange={setAddForm}
              onSave={handleAddSave}
              onCancel={() => { setShowAddForm(false); setAddForm(emptyForm()) }}
              saving={isPending}
              t={translationSet}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground justify-start px-1"
                onClick={() => { setShowAddForm(true); setEditingNoteId(null) }}
              >
                <Plus size={13} />
                {translationSet.addNote}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground justify-start px-1"
                asChild
              >
                <Link href={`/protected/instructor/students/${studentId}`}>
                  <ExternalLink size={13} />
                  {translationSet.viewProfile}
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deletingNoteId} onOpenChange={(open) => { if (!open) setDeletingNoteId(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translationSet.confirmDelete}</DialogTitle>
            <DialogDescription>{translationSet.confirmDeleteDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingNoteId(null)} disabled={isPending}>
              {translationSet.no}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingNoteId && handleDelete(deletingNoteId)}
              disabled={isPending}
            >
              {isPending ? "…" : translationSet.yes}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History dialog */}
      <Dialog open={!!historyDialogNote} onOpenChange={(open) => { if (!open) setHistoryDialogNote(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{translationSet.historyDialogTitle}</DialogTitle>
          </DialogHeader>

          {historyLoading ? (
            <p className="text-sm text-muted-foreground">…</p>
          ) : historyEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">{translationSet.historyEmpty}</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
              {historyEntries.map((entry, index) => (
                <div key={entry.id} className="flex flex-col gap-1 p-3 rounded-lg border text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>
                      {index === historyEntries.length - 1
                        ? translationSet.originalContent
                        : `v${historyEntries.length - index}`}
                    </span>
                    <span>{translationSet.editedAt} {new Date(entry.edited_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryDialogNote(null)}>
              {translationSet.close}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
