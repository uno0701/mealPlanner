"use client"

interface Props {
  item: {
    id: string
    name: string
    quantity?: number | null
    unit?: string | null
    checked: boolean
    isManual: boolean
  }
  weekPlanId: string
  onUpdate: () => void
}

export default function GroceryItem({ item, weekPlanId, onUpdate }: Props) {
  async function toggleChecked() {
    await fetch(`/api/planner/${weekPlanId}/grocery/items`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, checked: !item.checked }),
    })
    onUpdate()
  }

  async function removeItem() {
    await fetch(`/api/planner/${weekPlanId}/grocery/items?itemId=${item.id}`, {
      method: "DELETE",
    })
    onUpdate()
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={toggleChecked}
        className="h-4 w-4 rounded border-gray-300"
      />
      <span className={`flex-1 text-sm ${item.checked ? "line-through text-gray-400" : "text-gray-700"}`}>
        {item.quantity && `${item.quantity} `}
        {item.unit && `${item.unit} `}
        {item.name}
        {item.isManual && <span className="ml-1 text-xs text-blue-400">(manual)</span>}
      </span>
      {item.isManual && (
        <button
          onClick={removeItem}
          className="text-xs text-red-400 hover:text-red-600"
        >
          Remove
        </button>
      )}
    </div>
  )
}
