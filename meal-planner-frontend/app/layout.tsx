import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MealMind - AI-Powered Meal Planning",
  description:
    "Create personalized meal plans with AI-generated recipes and nutritional breakdowns",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
