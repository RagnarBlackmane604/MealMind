export interface Credentials {
  email?: string
  password?: string
}

export const register = async (credentials: Credentials) => {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Registration failed")
  }

  return response.json()
}

export const login = async (credentials: Credentials) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Login failed")
  }

  return response.json()
}

export const fetchUserProfile = async (token: string) => {
  const response = await fetch("/api/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user profile")
  }

  return response.json()
}
