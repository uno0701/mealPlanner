"use client"

import { useState, useEffect, useCallback } from "react"
import { getWeekStart } from "@/lib/utils"
import WeekNavigator from "./WeekNavigator"
import DayColumn from "./DayColumn"
import RecipePicker from "./RecipePicker"

interface MealSlot {
  id: string
  day: number
  mealType: string
  recipe: { id: string; title: string }
}

interface WeekPlan {
  id: string
  weekStart: string
  status: string
  mealSlots: MealSlot[]
}

export default function WeekBoard() {
  const [weekStart, setWeekStart] = useState(() => getWeekStart())
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerTarget, setPickerTarget] = useState<{ day: number; mealType: string } | null>(null)

  const fetchPlan = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/planner?week=${weekStart.toISOString()}`)
    if (res.ok) {
      setWeekPlan(await res.json())
    }
    setLoading(false)
  }, [weekStart])

  useEffect(() => {
    fetchPlan()
  }, [fetchPlan])

  function handleAdd(day: number, mealType: string) {
    setPickerTarget({ day, mealType })
    setPickerOpen(true)
  }

  async function handleSelectRecipe(recipeId: string) {
    if (!weekPlan || !pickerTarget) return

    const res = await fetch(`/api/planner/${weekPlan.id}/slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day: pickerTarget.day,
        mealType: pickerTarget.mealType,
        recipeId,
      }),
    })

    if (res.ok) {
      fetchPlan()
    }
    setPickerTarget(null)
  }

  async function handleRemoveSlot(slotId: string) {
    if (!weekPlan) return
    await fetch(`/api/planner/${weekPlan.id}/slots?slotId=${slotId}`, {
      method: "DELETE",
    })
    fetchPlan()
  }

  async function toggleStatus() {
    if (!weekPlan) return
    const newStatus = weekPlan.status === "draft" ? "finalized" : "draft"
    const res = await fetch(`/api/planner/${weekPlan.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      fetchPlan()
    }
  }

  if (loading) return <p className="text-gray-500">Loading planner...</p>

  const isFinalized = weekPlan?.status === "finalized"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <WeekNavigator weekStart={weekStart} onNavigate={setWeekStart} />
        {weekPlan && (
          <button
            onClick={toggleStatus}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              isFinalized
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isFinalized ? "Reopen" : "Finalize"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: 7 }, (_, i) => (
          <DayColumn
            key={i}
            dayIndex={i}
            slots={weekPlan?.mealSlots.filter((s) => s.day === i) || []}
            onAdd={handleAdd}
            onRemove={handleRemoveSlot}
            isFinalized={isFinalized}
          />
        ))}
      </div>

      <RecipePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectRecipe}
      />
    </div>
  )
}
