"use client"

import { useState, useEffect, useCallback } from "react"
import { getWeekStart } from "@/lib/utils"

export interface CalendarMealSlot {
  id: string
  day: number
  mealType: string
  recipe: {
    id: string
    title: string
    description?: string | null
    instructions?: string | null
    prepTime?: number | null
    cookTime?: number | null
  }
}

export interface WeekPlanData {
  id: string
  weekStart: string
  status: string
  mealSlots: CalendarMealSlot[]
}

export function useCalendarData(startDate: Date, endDate: Date) {
  const [plans, setPlans] = useState<WeekPlanData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)

    const weeks: Date[] = []
    const current = getWeekStart(startDate)
    const end = new Date(endDate)
    end.setDate(end.getDate() + 7)

    while (current <= end) {
      weeks.push(new Date(current))
      current.setDate(current.getDate() + 7)
    }

    const results = await Promise.all(
      weeks.map(async (week) => {
        const res = await fetch(`/api/planner?week=${week.toISOString()}`)
        if (res.ok) return res.json() as Promise<WeekPlanData>
        return null
      })
    )

    setPlans(results.filter(Boolean) as WeekPlanData[])
    setLoading(false)
  }, [startDate.toISOString(), endDate.toISOString()])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  function getMealsForDate(date: Date): CalendarMealSlot[] {
    const targetWeekStart = getWeekStart(date)
    const dayOfWeek = ((date.getDay() + 6) % 7)

    const plan = plans.find((p) => {
      const planStart = new Date(p.weekStart)
      return (
        planStart.getFullYear() === targetWeekStart.getFullYear() &&
        planStart.getMonth() === targetWeekStart.getMonth() &&
        planStart.getDate() === targetWeekStart.getDate()
      )
    })

    if (!plan) return []
    return plan.mealSlots.filter((s) => s.day === dayOfWeek)
  }

  return { plans, loading, getMealsForDate }
}
