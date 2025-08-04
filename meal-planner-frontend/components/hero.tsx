import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, ChefHat } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Meal Planning</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
              Smart Meal Planning
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Create personalized meal plans tailored to your dietary preferences and health goals. Get AI-generated
            recipes with nutritional breakdowns and beautiful food images.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" asChild className="group hover:bg-primary/90 transition-all duration-200 hover:scale-105">
              <Link href="/signup" className="flex items-center">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:bg-accent transition-colors bg-transparent">
              <Link href="/demo">View Demo</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI Recipe Generation</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized recipes based on your preferences and dietary restrictions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Meal Plans</h3>
              <p className="text-sm text-muted-foreground">
                Automatically generated meal plans that fit your lifestyle and goals
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Nutritional Insights</h3>
              <p className="text-sm text-muted-foreground">
                Detailed nutritional breakdowns to help you meet your health goals
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
