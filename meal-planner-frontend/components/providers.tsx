"use client"

import type React from "react"
import { ThemeProvider } from "next-themes"
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { store } from "@/lib/store"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <SessionProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  )
}
