"use client"

import { useRef, useState, useCallback } from "react"
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  Minus,
} from "lucide-react"

interface ToolbarButton {
  icon: React.ReactNode
  title: string
  action: (selectedText: string) => { before: string; after: string; defaultText: string }
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  {
    icon: <Bold size={14} />,
    title: "Bold",
    action: (selected) => ({ before: "**", after: "**", defaultText: selected || "bold text" }),
  },
  {
    icon: <Italic size={14} />,
    title: "Italic",
    action: (selected) => ({ before: "*", after: "*", defaultText: selected || "italic text" }),
  },
  {
    icon: <Strikethrough size={14} />,
    title: "Strikethrough",
    action: (selected) => ({ before: "~~", after: "~~", defaultText: selected || "strikethrough text" }),
  },
  {
    icon: <Heading1 size={14} />,
    title: "Heading 1",
    action: (selected) => ({ before: "# ", after: "", defaultText: selected || "Heading 1" }),
  },
  {
    icon: <Heading2 size={14} />,
    title: "Heading 2",
    action: (selected) => ({ before: "## ", after: "", defaultText: selected || "Heading 2" }),
  },
  {
    icon: <Heading3 size={14} />,
    title: "Heading 3",
    action: (selected) => ({ before: "### ", after: "", defaultText: selected || "Heading 3" }),
  },
  {
    icon: <Code size={14} />,
    title: "Inline Code",
    action: (selected) => ({ before: "`", after: "`", defaultText: selected || "code" }),
  },
  {
    icon: <Link size={14} />,
    title: "Link",
    action: (selected) => ({
      before: "[",
      after: "](url)",
      defaultText: selected || "link text",
    }),
  },
  {
    icon: <List size={14} />,
    title: "Bulleted List",
    action: (selected) => ({ before: "- ", after: "", defaultText: selected || "list item" }),
  },
  {
    icon: <ListOrdered size={14} />,
    title: "Numbered List",
    action: (selected) => ({ before: "1. ", after: "", defaultText: selected || "list item" }),
  },
  {
    icon: <Quote size={14} />,
    title: "Blockquote",
    action: (selected) => ({ before: "> ", after: "", defaultText: selected || "quote" }),
  },
  {
    icon: <Minus size={14} />,
    title: "Horizontal Rule",
    action: () => ({ before: "\n---\n", after: "", defaultText: "" }),
  },
]

interface Props {
  name: string
  defaultValue?: string
  placeholder?: string
  rows?: number
  className?: string
}

export function MarkdownEditor({ name, defaultValue, placeholder, rows = 10, className }: Props) {
  const [value, setValue] = useState(defaultValue ?? "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const applyFormat = useCallback((button: ToolbarButton) => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }

    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd
    const selectedText = value.slice(selectionStart, selectionEnd)

    const { before, after, defaultText } = button.action(selectedText)
    const textToInsert = selectedText || defaultText

    const newValue =
      value.slice(0, selectionStart) + before + textToInsert + after + value.slice(selectionEnd)
    setValue(newValue)

    setTimeout(() => {
      textarea.focus()
      const newSelectionStart = selectionStart + before.length
      const newSelectionEnd = newSelectionStart + textToInsert.length
      textarea.setSelectionRange(newSelectionStart, newSelectionEnd)
    }, 0)
  }, [value])

  return (
    <div className={`flex flex-col rounded-md border border-input overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ${className ?? ""}`}>
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b bg-muted/40">
        {TOOLBAR_BUTTONS.map((button) => (
          <button
            key={button.title}
            type="button"
            title={button.title}
            onMouseDown={(event) => {
              event.preventDefault()
              applyFormat(button)
            }}
            className="flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {button.icon}
          </button>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="min-h-[160px] w-full px-3 py-2 text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none resize-y font-mono"
      />
    </div>
  )
}
