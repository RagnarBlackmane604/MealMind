import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireVerification() {
  const user = await requireAuth()
  if (!user.verified) {
    redirect("/verify-email")
  }
  return user
}

export async function requirePremium() {
  const user = await requireAuth()
  if (user.subscription !== "premium") {
    redirect("/pricing")
  }
  return user
}
