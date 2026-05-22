import type { Locale } from "@/lib/locale"

export const translations: Record<Locale, {
  notes: string
  noNotes: string
  addNote: string
  editNote: string
  deleteNote: string
  saveNote: string
  cancel: string
  content: string
  tags: string
  pinned: string
  history: string
  historyEmpty: string
  historyDialogTitle: string
  close: string
  confirmDelete: string
  confirmDeleteDescription: string
  yes: string
  no: string
  pinnedLabel: string
  noteAdded: string
  noteUpdated: string
  noteDeleted: string
  viewProfile: string
  editedAt: string
  originalContent: string
}> = {
  en: {
    notes: "Notes",
    noNotes: "No notes yet.",
    addNote: "Add note",
    editNote: "Edit",
    deleteNote: "Delete",
    saveNote: "Save",
    cancel: "Cancel",
    content: "Note",
    tags: "Tags",
    pinned: "Pin note",
    history: "History",
    historyEmpty: "No previous versions.",
    historyDialogTitle: "Edit history",
    close: "Close",
    confirmDelete: "Delete note",
    confirmDeleteDescription: "This note will be permanently deleted.",
    yes: "Delete",
    no: "Cancel",
    pinnedLabel: "Pinned",
    noteAdded: "Note added",
    noteUpdated: "Note updated",
    noteDeleted: "Note deleted",
    viewProfile: "View profile",
    editedAt: "Edited",
    originalContent: "Original",
  },
  pt: {
    notes: "Anotações",
    noNotes: "Nenhuma anotação ainda.",
    addNote: "Adicionar anotação",
    editNote: "Editar",
    deleteNote: "Excluir",
    saveNote: "Salvar",
    cancel: "Cancelar",
    content: "Anotação",
    tags: "Etiquetas",
    pinned: "Fixar anotação",
    history: "Histórico",
    historyEmpty: "Nenhuma versão anterior.",
    historyDialogTitle: "Histórico de edições",
    close: "Fechar",
    confirmDelete: "Excluir anotação",
    confirmDeleteDescription: "Esta anotação será excluída permanentemente.",
    yes: "Excluir",
    no: "Cancelar",
    pinnedLabel: "Fixada",
    noteAdded: "Anotação adicionada",
    noteUpdated: "Anotação atualizada",
    noteDeleted: "Anotação excluída",
    viewProfile: "Ver perfil",
    editedAt: "Editado",
    originalContent: "Original",
  },
  es: {
    notes: "Notas",
    noNotes: "Aún no hay notas.",
    addNote: "Agregar nota",
    editNote: "Editar",
    deleteNote: "Eliminar",
    saveNote: "Guardar",
    cancel: "Cancelar",
    content: "Nota",
    tags: "Etiquetas",
    pinned: "Fijar nota",
    history: "Historial",
    historyEmpty: "Sin versiones anteriores.",
    historyDialogTitle: "Historial de ediciones",
    close: "Cerrar",
    confirmDelete: "Eliminar nota",
    confirmDeleteDescription: "Esta nota se eliminará permanentemente.",
    yes: "Eliminar",
    no: "Cancelar",
    pinnedLabel: "Fijada",
    noteAdded: "Nota agregada",
    noteUpdated: "Nota actualizada",
    noteDeleted: "Nota eliminada",
    viewProfile: "Ver perfil",
    editedAt: "Editado",
    originalContent: "Original",
  },
}
