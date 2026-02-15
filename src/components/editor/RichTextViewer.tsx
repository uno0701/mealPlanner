"use client"

import { getTagSettings } from "@/lib/tag-settings"

interface Props {
  content: string
  onClick?: () => void
}

export default function RichTextViewer({ content, onClick }: Props) {
  const tagSettings = getTagSettings()

  if (!content || content === "<p></p>") {
    return (
      <div
        onClick={onClick}
        className={`rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400 ${
          onClick ? "cursor-pointer hover:border-blue-300" : ""
        }`}
      >
        No content yet. {onClick && "Click to start writing."}
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
    >
      <div className="px-8 py-6">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .recipe-viewer h3 {
                color: #4f46e5;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 4px;
                margin-top: 16px;
                font-size: 1.1rem;
                font-weight: 600;
              }
              .recipe-viewer p {
                margin: 8px 0;
                line-height: 1.6;
              }
              .recipe-viewer ul {
                list-style: disc;
                padding-left: 24px;
              }
              .recipe-viewer li {
                margin: 4px 0;
              }
              .recipe-viewer [data-icon-tag] {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 2px 8px;
                margin: 0 2px;
                border-radius: 4px;
                font-size: 13px;
                color: ${tagSettings.tagColor};
                background: ${tagSettings.tagBgColor};
                margin-left: 24px;
              }
              .recipe-viewer [data-icon-tag] svg {
                fill: currentColor;
                flex-shrink: 0;
              }
            `,
          }}
        />
        <div
          className="recipe-viewer prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      {onClick && (
        <div className="border-t border-gray-100 px-8 py-2 text-xs text-gray-400 text-center">
          Click to edit
        </div>
      )}
    </div>
  )
}
