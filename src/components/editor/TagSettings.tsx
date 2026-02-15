"use client"

import { useState, useEffect } from "react"
import { getTagSettings, saveTagSettings, type TagSettings as TagSettingsType } from "@/lib/tag-settings"
import { COOKING_ICONS } from "@/lib/icons"

interface Props {
  onClose: () => void
}

const COLOR_PRESETS = [
  { label: "Indigo", color: "#6366f1", bg: "#eef2ff" },
  { label: "Emerald", color: "#059669", bg: "#ecfdf5" },
  { label: "Rose", color: "#e11d48", bg: "#fff1f2" },
  { label: "Amber", color: "#d97706", bg: "#fffbeb" },
  { label: "Sky", color: "#0284c7", bg: "#f0f9ff" },
  { label: "Purple", color: "#9333ea", bg: "#faf5ff" },
]

export default function TagSettings({ onClose }: Props) {
  const [settings, setSettings] = useState<TagSettingsType>(getTagSettings())

  useEffect(() => {
    saveTagSettings(settings)
  }, [settings])

  const previewIcon = COOKING_ICONS[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tag Appearance</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">X</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Preset</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSettings({ tagColor: preset.color, tagBgColor: preset.bg })}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium border ${
                    settings.tagColor === preset.color
                      ? "border-gray-900 ring-1 ring-gray-900"
                      : "border-gray-200"
                  }`}
                  style={{ color: preset.color, backgroundColor: preset.bg }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Colors</label>
            <div className="flex gap-4">
              <div>
                <span className="text-xs text-gray-500">Text</span>
                <input
                  type="color"
                  value={settings.tagColor}
                  onChange={(e) => setSettings({ ...settings, tagColor: e.target.value })}
                  className="block mt-1 w-10 h-8 rounded cursor-pointer"
                />
              </div>
              <div>
                <span className="text-xs text-gray-500">Background</span>
                <input
                  type="color"
                  value={settings.tagBgColor}
                  onChange={(e) => setSettings({ ...settings, tagBgColor: e.target.value })}
                  className="block mt-1 w-10 h-8 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="rounded border border-gray-200 p-4 bg-gray-50">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  color: settings.tagColor,
                  backgroundColor: settings.tagBgColor,
                  marginLeft: "24px",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  style={{ fill: "currentColor" }}
                  dangerouslySetInnerHTML={{ __html: previewIcon.svg }}
                />
                {previewIcon.label}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Done
        </button>
      </div>
    </div>
  )
}
