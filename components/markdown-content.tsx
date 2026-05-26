"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Props {
  content: string
}

export function MarkdownContent({ content }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
    >
      {content}
    </ReactMarkdown>
    </div>
  )
}
