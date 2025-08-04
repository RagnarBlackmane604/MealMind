import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Ready to Transform Your Meal Planning?</span>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Start Your AI-Powered
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {" "}
            Meal Journey Today
          </span>
        </h2>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of users who have revolutionized their meal planning with MealMind's intelligent AI technology.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="group hover:bg-primary/90 transition-all duration-200 hover:scale-105">
            <Link href="/signup" className="flex items-center">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="hover:bg-accent transition-colors bg-transparent">
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          No credit card required • 7-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  )
}
