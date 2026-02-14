"use client"

import { useState } from "react"

interface Props {
  weekPlanId: string
  onAdded: () => void
}

export default function AddItemForm({ weekPlanId, onAdded }: Props) {
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    await fetch(`/api/planner/${weekPlanId}/grocery/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        quantity: quantity ? parseFloat(quantity) : undefined,
        unit: unit || undefined,
      }),
    })

    setName("")
    setQuantity("")
    setUnit("")
    onAdded()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm"
      />
      <input
        type="number"
        placeholder="Qty"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
      />
      <input
        type="text"
        placeholder="Unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="w-16 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  )
}
