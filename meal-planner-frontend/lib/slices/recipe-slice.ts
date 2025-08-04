import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Recipe {
  id: string
  name: string
  description: string
  ingredients: Ingredient[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: "easy" | "medium" | "hard"
  cuisine: string
  dietaryTags: string[]
  nutritionalInfo: NutritionalInfo
  imageUrl?: string
  createdAt: string
}

interface Ingredient {
  name: string
  amount: number
  unit: string
}

interface NutritionalInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
}

interface RecipeState {
  currentRecipe: Recipe | null
  recipes: Recipe[]
  favorites: string[]
  isGenerating: boolean
  error: string | null
}

const initialState: RecipeState = {
  currentRecipe: null,
  recipes: [],
  favorites: [],
  isGenerating: false,
  error: null,
}

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setCurrentRecipe: (state, action: PayloadAction<Recipe>) => {
      state.currentRecipe = action.payload
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload)
    },
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const recipeId = action.payload
      if (state.favorites.includes(recipeId)) {
        state.favorites = state.favorites.filter((id) => id !== recipeId)
      } else {
        state.favorites.push(recipeId)
      }
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setCurrentRecipe, addRecipe, setRecipes, toggleFavorite, setGenerating, setError } = recipeSlice.actions

export default recipeSlice.reducer
