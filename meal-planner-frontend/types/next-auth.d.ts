import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    accessToken?: string;
    email?: string;
    name?: string;
    plan?: string;
    mealPlansUsed?: number;
    recipesUsed?: number;
    subscription?: string;
    verified?: boolean;
    allergies?: string[];
    // weitere Felder...
  }

  interface Session {
    user: User;
    accessToken?: string;
    subscription?: string;
    verified?: boolean;
    allergies?: string[];
    plan?: string;
    mealPlansUsed?: number;
    recipesUsed?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    accessToken?: string;
    subscription?: string;
    verified?: boolean;
    allergies?: string[];
    plan?: string;
    mealPlansUsed?: number;
    recipesUsed?: number;
  }
}
