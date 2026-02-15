"use client"

import { useMemo } from "react"
import { useCalendarData } from "./useCalendarData"

const TOQUE_SVG = `<path d="M12 2C9.24 2 7 4.24 7 7c-2.21 0-4 1.79-4 4 0 1.86 1.28 3.41 3 3.86V17h12v-2.14c1.72-.45 3-2 3-3.86 0-2.21-1.79-4-4-4 0-2.76-2.24-5-5-5zM8 19v1c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1H8z" fill="currentColor"/>`

interface Props {
  currentDate: Date
  onSelectDate: (date: Date) => void
}

export default function MonthView({ currentDate, onSelectDate }: Props) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const { firstDay, days, startDate, endDate } = useMemo(() => {
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    const startOffset = (first.getDay() + 6) % 7
    const start = new Date(first)
    start.setDate(start.getDate() - startOffset)
    const totalDays = startOffset + last.getDate()
    const totalCells = Math.ceil(totalDays / 7) * 7
    const allDays: Date[] = []
    const d = new Date(start)
    for (let i = 0; i < totalCells; i++) {
      allDays.push(new Date(d))
      d.setDate(d.getDate() + 1)
    }
    const end = allDays[allDays.length - 1]
    return { firstDay: first, days: allDays, startDate: start, endDate: end }
  }, [year, month])

  const { loading, getMealsForDate } = useCalendarData(startDate, endDate)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <div>
      <div className="grid grid-cols-7 border-b border-gray-200">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-gray-200">
        {days.map((day, i) => {
          const isCurrentMonth = day.getMonth() === month
          const isToday =
            day.getFullYear() === today.getFullYear() &&
            day.getMonth() === today.getMonth() &&
            day.getDate() === today.getDate()
          const meals = getMealsForDate(day)
          const hasMeals = meals.length > 0

          return (
            <div
              key={i}
              onClick={() => onSelectDate(day)}
              className={`min-h-[100px] border-r border-b border-gray-200 p-1.5 cursor-pointer hover:bg-blue-50 transition-colors ${
                !isCurrentMonth ? "bg-gray-50" : "bg-white"
              } ${isToday ? "ring-2 ring-inset ring-blue-500" : ""}`}
            >
              <div className="flex items-center gap-1 mb-1">
                {hasMeals ? (
                  <span className="relative inline-flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-7 h-7 text-amber-500 absolute"
                      dangerouslySetInnerHTML={{ __html: TOQUE_SVG }}
                    />
                    <span
                      className={`relative z-10 text-xs font-bold ${
                        isCurrentMonth ? "text-amber-900" : "text-gray-400"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </span>
                ) : (
                  <span
                    className={`text-xs font-medium ${
                      isToday
                        ? "text-blue-600 font-bold"
                        : isCurrentMonth
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                )}
              </div>
              {!loading && (
                <div className="space-y-0.5 overflow-hidden max-h-[60px]">
                  {meals.slice(0, 3).map((meal) => (
                    <div
                      key={meal.id}
                      className="text-[10px] text-gray-600 truncate leading-tight px-0.5"
                    >
                      <span className="text-gray-400 capitalize">{meal.mealType[0]}:</span>{" "}
                      {meal.recipe.title}
                    </div>
                  ))}
                  {meals.length > 3 && (
                    <div className="text-[10px] text-gray-400 px-0.5">
                      +{meals.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
