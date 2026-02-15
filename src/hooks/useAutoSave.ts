"use client"

import { useRef, useState, useCallback, useEffect } from "react"

export type SaveStatus = "idle" | "saving" | "saved" | "error"

interface UseAutoSaveOptions {
  /** Function that performs the save — should return a promise */
  saveFn: (content: string) => Promise<void>
  /** Debounce delay in ms (default 1500) */
  delay?: number
}

export function useAutoSave({ saveFn, delay = 1500 }: UseAutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle")
  const lastSavedRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const saveFnRef = useRef(saveFn)
  saveFnRef.current = saveFn

  const trigger = useCallback(
    (content: string) => {
      // Clear any pending debounce
      if (timerRef.current) clearTimeout(timerRef.current)

      timerRef.current = setTimeout(async () => {
        // Skip if content hasn't changed from last saved value
        if (content === lastSavedRef.current) return

        // Abort previous in-flight save
        if (abortRef.current) abortRef.current.abort()
        const controller = new AbortController()
        abortRef.current = controller

        setStatus("saving")
        try {
          await saveFnRef.current(content)
          if (!controller.signal.aborted) {
            lastSavedRef.current = content
            setStatus("saved")
          }
        } catch {
          if (!controller.signal.aborted) {
            setStatus("error")
          }
        }
      }, delay)
    },
    [delay],
  )

  /** Set the initial "last saved" value so we don't re-save on mount */
  const setBaseline = useCallback((content: string) => {
    lastSavedRef.current = content
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  return { status, trigger, setBaseline }
}
