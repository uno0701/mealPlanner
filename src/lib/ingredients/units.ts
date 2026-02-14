const VOLUME_CONVERSIONS: Record<string, number> = {
  tsp: 1,
  tbsp: 3,
  "fl oz": 6,
  cup: 48,
  ml: 0.2029,
  l: 202.9,
}

const WEIGHT_CONVERSIONS: Record<string, number> = {
  oz: 1,
  lb: 16,
  g: 0.03527,
  kg: 35.274,
}

export function canConvert(unitA: string, unitB: string): boolean {
  const a = unitA.toLowerCase()
  const b = unitB.toLowerCase()
  return (
    (a in VOLUME_CONVERSIONS && b in VOLUME_CONVERSIONS) ||
    (a in WEIGHT_CONVERSIONS && b in WEIGHT_CONVERSIONS)
  )
}

export function convert(quantity: number, fromUnit: string, toUnit: string): number {
  const from = fromUnit.toLowerCase()
  const to = toUnit.toLowerCase()

  if (from in VOLUME_CONVERSIONS && to in VOLUME_CONVERSIONS) {
    const baseAmount = quantity * VOLUME_CONVERSIONS[from]
    return baseAmount / VOLUME_CONVERSIONS[to]
  }

  if (from in WEIGHT_CONVERSIONS && to in WEIGHT_CONVERSIONS) {
    const baseAmount = quantity * WEIGHT_CONVERSIONS[from]
    return baseAmount / WEIGHT_CONVERSIONS[to]
  }

  return quantity
}

export function getBestUnit(totalInBaseUnit: number, unitType: "volume" | "weight"): { quantity: number; unit: string } {
  const conversions = unitType === "volume" ? VOLUME_CONVERSIONS : WEIGHT_CONVERSIONS

  let bestUnit = Object.keys(conversions)[0]
  let bestQuantity = totalInBaseUnit / conversions[bestUnit]

  for (const [unit, factor] of Object.entries(conversions)) {
    const converted = totalInBaseUnit / factor
    if (converted >= 1 && converted < bestQuantity) {
      bestQuantity = converted
      bestUnit = unit
    }
  }

  return { quantity: Math.round(bestQuantity * 100) / 100, unit: bestUnit }
}
