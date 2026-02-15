export interface CookingIcon {
  id: string
  label: string
  svg: string
}

export const COOKING_ICONS: CookingIcon[] = [
  {
    id: "toque",
    label: "Chef Hat",
    svg: `<path d="M12 2C9.24 2 7 4.24 7 7c-2.21 0-4 1.79-4 4 0 1.86 1.28 3.41 3 3.86V17h12v-2.14c1.72-.45 3-2 3-3.86 0-2.21-1.79-4-4-4 0-2.76-2.24-5-5-5zM8 19v1c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1H8z" fill="currentColor"/>`,
  },
  {
    id: "thermometer",
    label: "Thermometer",
    svg: `<path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1v3h-2V5z" fill="currentColor"/>`,
  },
  {
    id: "recipe-book",
    label: "Recipe Book",
    svg: `<path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" fill="currentColor"/>`,
  },
  {
    id: "spices",
    label: "Spices",
    svg: `<path d="M6 21h12v-2H6v2zM7 3v2h10V3H7zm5 7.5c-2.49 0-4.5 2.01-4.5 4.5h9c0-2.49-2.01-4.5-4.5-4.5zM8 7l-1 3h10l-1-3H8z" fill="currentColor"/>`,
  },
  {
    id: "measuring-cup",
    label: "Measuring Cup",
    svg: `<path d="M7 2v2h1v14c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V4h1V2H7zm6 16h-2V4h2v14zm4-10h2v2h-2zm0-4h2v2h-2zm0 8h2v2h-2z" fill="currentColor"/>`,
  },
  {
    id: "fire-stove",
    label: "Fire & Stove",
    svg: `<path d="M12 12.5c-1.77 0-3.5.69-3.5 2.5 0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44L12 15.5l.58 1.56c.41.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1.81-1.73-2.5-3.5-2.5zM12 2C8.14 6.5 5 9.5 5 13c0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.5-3.14-6.5-7-11z" fill="currentColor"/>`,
  },
  {
    id: "knife",
    label: "Knife",
    svg: `<path d="M19.78 2.22l-1.06 1.06L5 17l2 2L20.72 5.28l1.06-1.06-2-2zM3 19l2 2 3-3-2-2-3 3z" fill="currentColor"/>`,
  },
  {
    id: "whisk",
    label: "Whisk",
    svg: `<path d="M12 2C10 5 8 8 8 11c0 2.21 1.79 4 4 4s4-1.79 4-4c0-3-2-6-4-9zm-1 9c0-1.5.67-3.28 1-4.28.33 1 1 2.78 1 4.28 0 .55-.45 1-1 1s-1-.45-1-1zM9 17h6v2H9v-2zm1 4h4v1h-4v-1z" fill="currentColor"/>`,
  },
  {
    id: "timer",
    label: "Timer",
    svg: `<path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="currentColor"/>`,
  },
  {
    id: "oven",
    label: "Oven",
    svg: `<path d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 6v12h16V8H4zm2-4v2h2V4H6zm4 0v2h2V4h-2zm7 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM6 10h12v8H6v-8z" fill="currentColor"/>`,
  },
  {
    id: "pot",
    label: "Cooking Pot",
    svg: `<path d="M8 4V2h8v2h-3v1.07A7.99 7.99 0 0120 15v3H4v-3a7.99 7.99 0 017-7.93V4H8zm-4 16h16v2H4v-2z" fill="currentColor"/>`,
  },
  {
    id: "pan",
    label: "Frying Pan",
    svg: `<path d="M17 8c0-2.76-2.24-5-5-5S7 5.24 7 8c0 2.41 1.71 4.43 4 4.9V22h2v-9.1c2.29-.47 4-2.49 4-4.9zm7 0h-4c0 3.87-3.13 7-7 7v2c4.97 0 9-4.03 9-9h2z" fill="currentColor"/>`,
  },
  {
    id: "cutting-board",
    label: "Cutting Board",
    svg: `<path d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H6zm0 2h12v16H6V4zm2 2v2h8V6H8zm0 4v2h5v-2H8z" fill="currentColor"/>`,
  },
  {
    id: "spatula",
    label: "Spatula",
    svg: `<path d="M13 2v8h-2V2h2zm-1 10c-1.66 0-3 1.34-3 3v7h6v-7c0-1.66-1.34-3-3-3z" fill="currentColor"/>`,
  },
  {
    id: "rolling-pin",
    label: "Rolling Pin",
    svg: `<path d="M3.5 6.5l1.41-1.41L7 7.17V4h2v5.59L6.91 7.5 5.5 8.91 3.5 6.5zm17 11l-1.41 1.41L17 16.83V20h-2v-5.59l2.09 2.09 1.41-1.41 2 2.41zM7 12h10c1.1 0 2 .9 2 2s-.9 2-2 2H7c-1.1 0-2-.9-2-2s.9-2 2-2z" fill="currentColor"/>`,
  },
]

export const DEFAULT_TAG_COLOR = "#6366f1"

export function getIconById(id: string): CookingIcon | undefined {
  return COOKING_ICONS.find((icon) => icon.id === id)
}
