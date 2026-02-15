"use client"

import { useMemo } from "react"
import { getWeekStart, DAYS, MEAL_TYPES } from "@/lib/utils"
import { useCalendarData } from "./useCalendarData"

interface Props {
  currentDate: Date
  onSelectDate: (date: Date) => void
}

export default function WeekView({ currentDate, onSelectDate }: Props) {
  const weekStart = useMemo(() => getWeekStart(currentDate), [currentDate])

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [weekStart])

  const weekEnd = weekDays[6]
  const { loading, getMealsForDate } = useCalendarData(weekStart, weekEnd)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="grid grid-cols-7 gap-3">
      {weekDays.map((day, i) => {
        const isToday =
          day.getFullYear() === today.getFullYear() &&
          day.getMonth() === today.getMonth() &&
          day.getDate() === today.getDate()
        const meals = getMealsForDate(day)

        return (
          <div
            key={i}
            onClick={() => onSelectDate(day)}
            className={`rounded-lg border p-3 cursor-pointer hover:shadow-md transition-shadow ${
              isToday
                ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="text-center mb-3">
              <div className="text-xs text-gray-500">{DAYS[i]}</div>
              <div
                className={`text-lg font-semibold ${
                  isToday ? "text-blue-600" : "text-gray-900"
                }`}
              >
                {day.getDate()}
              </div>
              <div className="text-[10px] text-gray-400">
                {day.toLocaleDateString("en-US", { month: "short" })}
              </div>
            </div>

            {loading ? (
              <div className="text-xs text-gray-400 text-center">...</div>
            ) : (
              <div className="space-y-2">
                {MEAL_TYPES.map((mealType) => {
                  const mealSlots = meals.filter((m) => m.mealType === mealType)
                  if (mealSlots.length === 0) return null

                  return (
                    <div key={mealType}>
                      <p className="text-[10px] font-medium text-gray-400 uppercase mb-0.5">
                        {mealType}
                      </p>
                      {mealSlots.map((slot) => {
                        const prep = slot.recipe.prepTime || 0
                        const cook = slot.recipe.cookTime || 0
                        return (
                          <div
                            key={slot.id}
                            className="rounded bg-indigo-50 px-2 py-1 mb-1"
                          >
                            <div className="text-xs font-medium text-gray-800 truncate">
                              {slot.recipe.title}
                            </div>
                            {(prep > 0 || cook > 0) && (
                              <div className="text-[10px] text-gray-500">
                                {prep > 0 && `Prep: ${prep}m`}
                                {prep > 0 && cook > 0 && " · "}
                                {cook > 0 && `Cook: ${cook}m`}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
                {meals.length === 0 && (
                  <p className="text-[10px] text-gray-300 text-center py-2">No meals</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
