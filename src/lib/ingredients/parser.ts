export interface ParsedIngredient {
  name: string
  quantity: number
  unit: string
}

export function parseIngredient(
  name: string,
  quantity: number,
  unit: string
): ParsedIngredient {
  return {
    name: name.toLowerCase().trim(),
    quantity,
    unit: unit.toLowerCase().trim(),
  }
}
