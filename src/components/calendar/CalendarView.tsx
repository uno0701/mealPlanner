"use client"

import { useState } from "react"
import { getWeekStart } from "@/lib/utils"
import MonthView from "./MonthView"
import WeekView from "./WeekView"
import DayView from "./DayView"

type ViewMode = "month" | "week" | "day"

export default function CalendarView() {
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [currentDate, setCurrentDate] = useState(new Date())

  function navigateBack() {
    const d = new Date(currentDate)
    if (viewMode === "month") d.setMonth(d.getMonth() - 1)
    else if (viewMode === "week") d.setDate(d.getDate() - 7)
    else d.setDate(d.getDate() - 1)
    setCurrentDate(d)
  }

  function navigateForward() {
    const d = new Date(currentDate)
    if (viewMode === "month") d.setMonth(d.getMonth() + 1)
    else if (viewMode === "week") d.setDate(d.getDate() + 7)
    else d.setDate(d.getDate() + 1)
    setCurrentDate(d)
  }

  function goToToday() {
    setCurrentDate(new Date())
  }

  function getTitle() {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
    if (viewMode === "week") {
      const ws = getWeekStart(currentDate)
      const we = new Date(ws)
      we.setDate(we.getDate() + 6)
      const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
      return `${ws.toLocaleDateString("en-US", opts)} - ${we.toLocaleDateString("en-US", opts)}, ${ws.getFullYear()}`
    }
    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={navigateBack}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            &larr;
          </button>
          <button
            onClick={goToToday}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={navigateForward}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            &rarr;
          </button>
          <h2 className="text-lg font-semibold ml-3">{getTitle()}</h2>
        </div>
        <div className="flex rounded-md border border-gray-300 overflow-hidden">
          {(["month", "week", "day"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-1.5 text-sm font-medium capitalize ${
                viewMode === mode
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "month" && (
        <MonthView
          currentDate={currentDate}
          onSelectDate={(d) => {
            setCurrentDate(d)
            setViewMode("day")
          }}
        />
      )}
      {viewMode === "week" && (
        <WeekView
          currentDate={currentDate}
          onSelectDate={(d) => {
            setCurrentDate(d)
            setViewMode("day")
          }}
        />
      )}
      {viewMode === "day" && <DayView currentDate={currentDate} />}
    </div>
  )
}
