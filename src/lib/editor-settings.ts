const STORAGE_KEY = "editor-settings"

export interface EditorSettings {
  fontSize: string
  fontFamily: string
  toolbarCollapsed: boolean
}

const DEFAULTS: EditorSettings = {
  fontSize: "",
  fontFamily: "",
  toolbarCollapsed: false,
}

export function getEditorSettings(): EditorSettings {
  if (typeof window === "undefined") return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

export function saveEditorSettings(partial: Partial<EditorSettings>) {
  if (typeof window === "undefined") return
  const current = getEditorSettings()
  const next = { ...current, ...partial }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}
