import { canConvert, convert } from "./units"
import type { ParsedIngredient } from "./parser"

interface AggregatedItem {
  name: string
  quantity: number
  unit: string
}

export function aggregateIngredients(ingredients: ParsedIngredient[]): AggregatedItem[] {
  const map = new Map<string, AggregatedItem[]>()

  for (const ing of ingredients) {
    const key = ing.name
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key)!.push({ ...ing })
  }

  const result: AggregatedItem[] = []

  for (const [name, items] of map.entries()) {
    const merged: AggregatedItem[] = []

    for (const item of items) {
      const existing = merged.find((m) => canConvert(m.unit, item.unit))
      if (existing) {
        existing.quantity += convert(item.quantity, item.unit, existing.unit)
        existing.quantity = Math.round(existing.quantity * 100) / 100
      } else {
        merged.push({ name, quantity: item.quantity, unit: item.unit })
      }
    }

    result.push(...merged)
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
}
