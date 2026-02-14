"use client"

interface Props {
  slot: {
    id: string
    recipe: { id: string; title: string }
  }
  onRemove: (slotId: string) => void
  disabled?: boolean
}

export default function MealSlotCard({ slot, onRemove, disabled }: Props) {
  return (
    <div className="flex items-center justify-between rounded bg-blue-50 px-2 py-1 text-sm">
      <span className="truncate">{slot.recipe.title}</span>
      {!disabled && (
        <button
          onClick={() => onRemove(slot.id)}
          className="ml-2 text-red-400 hover:text-red-600"
        >
          x
        </button>
      )}
    </div>
  )
}
