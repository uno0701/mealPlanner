"use client"

import { useState, useEffect } from "react"
import { ALL_UNITS } from "@/lib/units"

interface Ingredient {
  name: string
  quantity: number
  unit: string
  notes?: string
}

interface Props {
  ingredients: Ingredient[]
  onChange: (ingredients: Ingredient[]) => void
}

export default function IngredientInput({ ingredients, onChange }: Props) {
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  function addIngredient() {
    onChange([...ingredients, { name: "", quantity: 1, unit: "whole", notes: "" }])
  }

  function removeIngredient(index: number) {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string | number) {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    )
    onChange(updated)
  }

  useEffect(() => {
    if (activeIndex === null) return
    const name = ingredients[activeIndex]?.name
    if (!name || name.length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/ingredients?q=${encodeURIComponent(name)}`)
      if (res.ok) {
        setSuggestions(await res.json())
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [activeIndex, ingredients])

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Ingredients</label>
      {ingredients.map((ing, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ingredient name"
              value={ing.name}
              onChange={(e) => {
                updateIngredient(index, "name", e.target.value)
                setActiveIndex(index)
              }}
              onBlur={() => setTimeout(() => setActiveIndex(null), 200)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            {activeIndex === index && suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onMouseDown={() => {
                      updateIngredient(index, "name", s.name)
                      setActiveIndex(null)
                    }}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={ing.quantity}
            onChange={(e) => updateIngredient(index, "quantity", parseFloat(e.target.value) || 0)}
            className="w-20 rounded-md border border-gray-300 px-2 py-2 text-sm"
          />
          <select
            value={ing.unit}
            onChange={(e) => updateIngredient(index, "unit", e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-2 text-sm"
          >
            {ALL_UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Notes"
            value={ing.notes || ""}
            onChange={(e) => updateIngredient(index, "notes", e.target.value)}
            className="w-24 rounded-md border border-gray-300 px-2 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => removeIngredient(index)}
            className="text-red-500 hover:text-red-700 px-2 py-2"
          >
            X
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addIngredient}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        + Add Ingredient
      </button>
    </div>
  )
}
