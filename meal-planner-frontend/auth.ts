import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

// Zod-Schema für Credentials
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Typ für credentials
type CredentialsType = z.infer<typeof loginSchema>;

const config = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            }
          );

          if (!res.ok) {
            return null;
          }
          const user = await res.json();

          return user;
        } catch (err) {
          console.error("❌ Credentials login error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.picture;
      }
      if (account?.provider === "google") {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_token: account.id_token }),
          }
        );
        const data = await res.json();
        token.id = data.id;
        token.accessToken = data.token;
        token.name = data.name;
        token.email = data.email;
        token.picture = data.picture;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET!,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
