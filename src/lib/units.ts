export const UNITS = {
  volume: ["tsp", "tbsp", "cup", "fl oz", "ml", "L"],
  weight: ["oz", "lb", "g", "kg"],
  count: ["whole", "piece", "slice", "clove"],
  other: ["pinch", "dash", "bunch", "can"],
} as const

export const ALL_UNITS = Object.values(UNITS).flat()

export type Unit = (typeof ALL_UNITS)[number]
