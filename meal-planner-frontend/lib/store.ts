import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/auth-slice"
import mealPlanSlice from "./slices/meal-plan-slice"
import recipeSlice from "./slices/recipe-slice"
import userSlice from "./slices/user-slice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    mealPlan: mealPlanSlice,
    recipe: recipeSlice,
    user: userSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
