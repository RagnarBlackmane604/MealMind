"use Server";
// UPDATED
import { signIn, signOut } from "next-auth/react";

export const signup = async (email: string, password: string) => {};

export const login = async (
  email: string,
  password: string,
  callbackUrl: string
) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const loginWithGoogle = async (callbackUrl: string) => {
  try {
    await signIn("google", { redirect: false, callbackUrl });
    return true;
  } catch (error) {
    return false;
  }
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
