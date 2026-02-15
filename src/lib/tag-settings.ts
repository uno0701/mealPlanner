const TAG_SETTINGS_KEY = "mealplanner-tag-settings"

export interface TagSettings {
  tagColor: string
  tagBgColor: string
}

const DEFAULT_SETTINGS: TagSettings = {
  tagColor: "#6366f1",
  tagBgColor: "#eef2ff",
}

export function getTagSettings(): TagSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  try {
    const stored = localStorage.getItem(TAG_SETTINGS_KEY)
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {}
  return DEFAULT_SETTINGS
}

export function saveTagSettings(settings: Partial<TagSettings>) {
  if (typeof window === "undefined") return
  const current = getTagSettings()
  const updated = { ...current, ...settings }
  localStorage.setItem(TAG_SETTINGS_KEY, JSON.stringify(updated))
  return updated
}
