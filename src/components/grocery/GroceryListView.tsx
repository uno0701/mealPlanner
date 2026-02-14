"use client"

import { useState, useEffect, useCallback } from "react"
import { getWeekStart } from "@/lib/utils"
import GroceryItem from "./GroceryItem"
import AddItemForm from "./AddItemForm"
import ShareButton from "./ShareButton"

interface GroceryListItem {
  id: string
  name: string
  quantity?: number | null
  unit?: string | null
  checked: boolean
  isManual: boolean
}

interface GroceryList {
  id: string
  shared: boolean
  items: GroceryListItem[]
}

interface WeekPlan {
  id: string
  status: string
}

export default function GroceryListView() {
  const [weekPlan, setWeekPlan] = useState<WeekPlan | null>(null)
  const [groceryList, setGroceryList] = useState<GroceryList | null>(null)
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
    setWeekPlan(plan)

    const groceryRes = await fetch(`/api/planner/${plan.id}/grocery`)
    if (groceryRes.ok) {
      const data = await groceryRes.json()
      setGroceryList(data.items ? data : null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function generateList() {
    if (!weekPlan) return
    setLoading(true)
    const res = await fetch(`/api/planner/${weekPlan.id}/grocery`, {
      method: "POST",
    })
    if (res.ok) {
      setGroceryList(await res.json())
    }
    setLoading(false)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>
  if (!weekPlan) return <p className="text-gray-500">No meal plan found for this week.</p>

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={generateList}
          className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
        >
          {groceryList ? "Regenerate List" : "Generate Grocery List"}
        </button>
        {weekPlan && groceryList && (
          <ShareButton weekPlanId={weekPlan.id} shared={groceryList.shared} onUpdate={fetchData} />
        )}
      </div>

      {groceryList && groceryList.items.length > 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="divide-y divide-gray-100">
            {groceryList.items.map((item) => (
              <GroceryItem
                key={item.id}
                item={item}
                weekPlanId={weekPlan.id}
                onUpdate={fetchData}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No items yet. Generate a grocery list from your meal plan.</p>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Add item manually</h3>
        <AddItemForm weekPlanId={weekPlan.id} onAdded={fetchData} />
      </div>
    </div>
  )
}
