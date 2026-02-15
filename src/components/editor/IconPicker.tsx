"use client"

import { useState } from "react"
import { COOKING_ICONS, type CookingIcon } from "@/lib/icons"

interface Props {
  onSelect: (icon: CookingIcon) => void
  onClose: () => void
}

export default function IconPicker({ onSelect, onClose }: Props) {
  const [search, setSearch] = useState("")

  const filtered = COOKING_ICONS.filter((icon) =>
    icon.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="absolute z-50 mt-1 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Insert Tag</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">X</button>
      </div>
      <input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
        autoFocus
      />
      <div className="grid grid-cols-5 gap-1 max-h-48 overflow-y-auto">
        {filtered.map((icon) => (
          <button
            key={icon.id}
            onClick={() => {
              onSelect(icon)
              onClose()
            }}
            title={icon.label}
            className="flex flex-col items-center gap-1 rounded p-2 hover:bg-indigo-50 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-indigo-500"
              dangerouslySetInnerHTML={{ __html: icon.svg }}
            />
            <span className="text-[10px] text-gray-500 truncate w-full text-center">
              {icon.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
