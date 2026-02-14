"use client"

import { MEAL_TYPES, DAYS } from "@/lib/utils"
import MealSlotCard from "./MealSlotCard"

interface MealSlot {
  id: string
  day: number
  mealType: string
  recipe: { id: string; title: string }
}

interface Props {
  dayIndex: number
  slots: MealSlot[]
  onAdd: (day: number, mealType: string) => void
  onRemove: (slotId: string) => void
  isFinalized: boolean
}

export default function DayColumn({ dayIndex, slots, onAdd, onRemove, isFinalized }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{DAYS[dayIndex]}</h3>
      <div className="space-y-2">
        {MEAL_TYPES.map((mealType) => {
          const mealSlots = slots.filter((s) => s.mealType === mealType)
          return (
            <div key={mealType}>
              <p className="text-xs font-medium text-gray-500 capitalize mb-1">{mealType}</p>
              <div className="space-y-1">
                {mealSlots.map((slot) => (
                  <MealSlotCard
                    key={slot.id}
                    slot={slot}
                    onRemove={onRemove}
                    disabled={isFinalized}
                  />
                ))}
                {!isFinalized && (
                  <button
                    onClick={() => onAdd(dayIndex, mealType)}
                    className="w-full rounded border border-dashed border-gray-300 py-1 text-xs text-gray-400 hover:border-blue-400 hover:text-blue-500"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
