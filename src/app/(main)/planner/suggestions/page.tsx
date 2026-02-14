"use client"

import { useState, useEffect, useCallback } from "react"
import { getWeekStart, DAYS } from "@/lib/utils"

interface Suggestion {
  id: string
  day: number
  mealType: string
  note?: string | null
  status: string
  recipe: { id: string; title: string }
  user: { name?: string | null; email: string }
  createdAt: string
}

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [weekPlanId, setWeekPlanId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const weekStart = getWeekStart()
    const planRes = await fetch(`/api/planner?week=${weekStart.toISOString()}`)
    if (!planRes.ok) {
      setLoading(false)
      return
    }

    const plan = await planRes.json()
    setWeekPlanId(plan.id)

    const sugRes = await fetch(`/api/planner/${plan.id}/suggestions`)
    if (sugRes.ok) {
      setSuggestions(await sugRes.json())
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleAction(suggestionId: string, status: "accepted" | "rejected") {
    if (!weekPlanId) return
    await fetch(`/api/planner/${weekPlanId}/suggestions`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestionId, status }),
    })
    fetchData()
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meal Suggestions</h1>
      {suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions for this week.</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {s.recipe.title} - {DAYS[s.day]} {s.mealType}
                  </p>
                  <p className="text-xs text-gray-500">
                    Suggested by {s.user.name || s.user.email}
                    {s.note && ` - "${s.note}"`}
                  </p>
                </div>
                {s.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(s.id, "accepted")}
                      className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(s.id, "rejected")}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      s.status === "accepted" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {s.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
