"use client"

import { formatWeekRange } from "@/lib/utils"

interface Props {
  weekStart: Date
  onNavigate: (weekStart: Date) => void
}

export default function WeekNavigator({ weekStart, onNavigate }: Props) {
  function goToPreviousWeek() {
    const prev = new Date(weekStart)
    prev.setDate(prev.getDate() - 7)
    onNavigate(prev)
  }

  function goToNextWeek() {
    const next = new Date(weekStart)
    next.setDate(next.getDate() + 7)
    onNavigate(next)
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={goToPreviousWeek}
        className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
      >
        &larr; Prev
      </button>
      <h2 className="text-lg font-semibold">{formatWeekRange(weekStart)}</h2>
      <button
        onClick={goToNextWeek}
        className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
      >
        Next &rarr;
      </button>
    </div>
  )
}
