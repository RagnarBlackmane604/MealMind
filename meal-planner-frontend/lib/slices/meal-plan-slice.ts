import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MealPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  meals: Meal[];
  nutritionalInfo: NutritionalInfo;
  createdAt: string;
}

interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  day: number;
  recipeId?: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  nutritionalInfo: NutritionalInfo;
}

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface MealPlanState {
  currentMealPlan: MealPlan | null;
  mealPlans: MealPlan[];
  isGenerating: boolean;
  error: string | null;
}

const initialState: MealPlanState = {
  currentMealPlan: null,
  mealPlans: [],
  isGenerating: false,
  error: null,
};

const mealPlanSlice = createSlice({
  name: "mealPlan",
  initialState,
  reducers: {
    setCurrentMealPlan: (state, action: PayloadAction<MealPlan>) => {
      state.currentMealPlan = action.payload;
    },
    addMealPlan: (state, action: PayloadAction<MealPlan>) => {
      state.mealPlans.push(action.payload);
    },
    setMealPlans: (state, action: PayloadAction<MealPlan[]>) => {
      state.mealPlans = action.payload;
    },
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearCurrentMealPlan: (state) => {
      state.currentMealPlan = null;
    },
  },
});

export const {
  setCurrentMealPlan,
  addMealPlan,
  setMealPlans,
  setGenerating,
  setError,
  clearCurrentMealPlan,
} = mealPlanSlice.actions;

export default mealPlanSlice.reducer;
