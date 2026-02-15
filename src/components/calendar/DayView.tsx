"use client"

import { useMemo } from "react"
import { getWeekStart, DAYS, MEAL_TYPES } from "@/lib/utils"
import { useCalendarData, type CalendarMealSlot } from "./useCalendarData"

interface Props {
  currentDate: Date
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

export default function DayView({ currentDate }: Props) {
  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate])
  const weekEnd = useMemo(() => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 6)
    return d
  }, [weekStart])

  const { loading, getMealsForDate } = useCalendarData(weekStart, weekEnd)

  const meals = getMealsForDate(currentDate)
  const dayIndex = ((currentDate.getDay() + 6) % 7)
  const dayName = DAYS[dayIndex]

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isToday =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getDate() === today.getDate()

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`rounded-lg border p-6 mb-6 ${
          isToday ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
        }`}
      >
        <div className="text-center">
          <div className="text-sm text-gray-500">{dayName}</div>
          <div className="text-3xl font-bold text-gray-900">{currentDate.getDate()}</div>
          <div className="text-sm text-gray-500">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
          {isToday && (
            <span className="inline-block mt-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] text-white font-medium">
              Today
            </span>
          )}
        </div>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No meals planned for this day.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {MEAL_TYPES.map((mealType) => {
            const mealSlots = meals.filter((m) => m.mealType === mealType)
            if (mealSlots.length === 0) return null

            return (
              <div key={mealType}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b border-gray-200 pb-1">
                  {mealType}
                </h3>
                {mealSlots.map((slot) => (
                  <MealDetail key={slot.id} slot={slot} />
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function MealDetail({ slot }: { slot: CalendarMealSlot }) {
  const { recipe } = slot
  const prep = recipe.prepTime || 0
  const cook = recipe.cookTime || 0

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 mb-3 shadow-sm">
      <h4 className="text-lg font-semibold text-gray-900 mb-1">{recipe.title}</h4>

      {(prep > 0 || cook > 0) && (
        <div className="flex gap-4 text-sm text-gray-500 mb-3">
          {prep > 0 && <span>Prep: {prep} min</span>}
          {cook > 0 && <span>Cook: {cook} min</span>}
          {prep + cook > 0 && <span>Total: {prep + cook} min</span>}
        </div>
      )}

      {recipe.description && (
        <p className="text-sm text-gray-600 mb-3">{stripHtml(recipe.description)}</p>
      )}

      {recipe.instructions && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Preparation Notes</h5>
          <div
            className="prose prose-sm max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: recipe.instructions }}
          />
        </div>
      )}
    </div>
  )
}
