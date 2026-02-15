"use client"

import { useEffect, useState } from "react"
import type { SaveStatus } from "@/hooks/useAutoSave"

export default function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (status === "saving" || status === "error") {
      setVisible(true)
    } else if (status === "saved") {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2000)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [status])

  if (!visible) return null

  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
        <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        Saving…
      </span>
    )
  }

  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-500 animate-fade-out">
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Saved
      </span>
    )
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-500">
        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Save failed
      </span>
    )
  }

  return null
}
