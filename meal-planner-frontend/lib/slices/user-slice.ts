import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserPreferences {
  dietaryRestrictions: string[]
  allergies: string[]
  cuisinePreferences: string[]
  healthGoals: string[]
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
  targetCalories?: number
  mealsPerDay: number
}

interface UserState {
  preferences: UserPreferences
  isLoading: boolean
}

const initialState: UserState = {
  preferences: {
    dietaryRestrictions: [],
    allergies: [],
    cuisinePreferences: [],
    healthGoals: [],
    activityLevel: "moderate",
    mealsPerDay: 3,
  },
  isLoading: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setPreferences, updatePreferences, setLoading } = userSlice.actions
export default userSlice.reducer
