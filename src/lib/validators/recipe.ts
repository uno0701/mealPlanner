import { z } from "zod"

export const ingredientSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  notes: z.string().optional(),
})

export const recipeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  instructions: z.string().optional(),
  servings: z.number().int().positive().default(4),
  prepTime: z.number().int().nonnegative().optional(),
  cookTime: z.number().int().nonnegative().optional(),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
})

export type RecipeInput = z.infer<typeof recipeSchema>
export type IngredientInput = z.infer<typeof ingredientSchema>
