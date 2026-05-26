"use client"

import { useRef, useState, useCallback } from "react"
import { MarkdownContent } from "@/components/markdown-content"
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

type Tab = "edit" | "preview"

interface ToolbarButton {
  icon: React.ReactNode
  title: string
  action: (selectedText: string) => { before: string; after: string; defaultText: string }
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  {
    icon: <Bold size={16} />,
    title: "Bold",
    action: (selected) => ({ before: "**", after: "**", defaultText: selected || "bold text" }),
  },
  {
    icon: <Italic size={16} />,
    title: "Italic",
    action: (selected) => ({ before: "*", after: "*", defaultText: selected || "italic text" }),
  },
  {
    icon: <Strikethrough size={16} />,
    title: "Strikethrough",
    action: (selected) => ({ before: "~~", after: "~~", defaultText: selected || "strikethrough text" }),
  },
  {
    icon: <Heading1 size={16} />,
    title: "Heading 1",
    action: (selected) => ({ before: "# ", after: "", defaultText: selected || "Heading 1" }),
  },
  {
    icon: <Heading2 size={16} />,
    title: "Heading 2",
    action: (selected) => ({ before: "## ", after: "", defaultText: selected || "Heading 2" }),
  },
  {
    icon: <Heading3 size={16} />,
    title: "Heading 3",
    action: (selected) => ({ before: "### ", after: "", defaultText: selected || "Heading 3" }),
  },
  {
    icon: <Code size={16} />,
    title: "Inline Code",
    action: (selected) => ({ before: "`", after: "`", defaultText: selected || "code" }),
  },
  {
    icon: <Link size={16} />,
    title: "Link",
    action: (selected) => ({
      before: "[",
      after: "](url)",
      defaultText: selected || "link text",
    }),
  },
  {
    icon: <List size={16} />,
    title: "Bulleted List",
    action: (selected) => ({ before: "- ", after: "", defaultText: selected || "list item" }),
  },
  {
    icon: <ListOrdered size={16} />,
    title: "Numbered List",
    action: (selected) => ({ before: "1. ", after: "", defaultText: selected || "list item" }),
  },
  {
    icon: <Quote size={16} />,
    title: "Blockquote",
    action: (selected) => ({ before: "> ", after: "", defaultText: selected || "quote" }),
  },
  {
    icon: <Minus size={16} />,
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
  const [activeTab, setActiveTab] = useState<Tab>("edit")
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
      <div className="flex items-center border-b bg-muted/40">
        <div className="flex border-r">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "edit"
                ? "text-foreground bg-background border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "preview"
                ? "text-foreground bg-background border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Preview
          </button>
        </div>

        {activeTab === "edit" && (
          <div className="flex flex-wrap gap-0.5 p-1.5">
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
        )}
      </div>

      {activeTab === "edit" ? (
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="min-h-[160px] w-full px-3 py-2 text-sm bg-background placeholder:text-muted-foreground focus-visible:outline-none resize-y font-mono"
        />
      ) : (
        <>
          <input type="hidden" name={name} value={value} />
          <div className="min-h-[160px] w-full px-3 py-2 text-sm bg-background">
            {value ? (
              <MarkdownContent content={value} />
            ) : (
              <p className="text-muted-foreground italic">{placeholder}</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
