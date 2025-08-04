import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name?: string
  email: string
  image?: string
  subscription: "free" | "premium"
  verified: boolean
  allergies: string[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    updateUserSubscription: (state, action: PayloadAction<"free" | "premium">) => {
      if (state.user) {
        state.user.subscription = action.payload
      }
    },
    updateUserVerification: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.verified = action.payload
      }
    },
  },
})

export const { setUser, clearUser, setLoading, updateUserSubscription, updateUserVerification } = authSlice.actions
export default authSlice.reducer
