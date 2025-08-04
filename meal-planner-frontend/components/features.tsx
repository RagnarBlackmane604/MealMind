import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Camera, BarChart3, Clock, Shield, Zap, Heart, Users } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Advanced AI algorithms create personalized meal plans based on your unique preferences, dietary restrictions, and health goals.",
      badge: "Core Feature",
    },
    {
      icon: Camera,
      title: "AI-Generated Food Images",
      description: "Beautiful, realistic food images generated for every recipe to inspire your cooking journey.",
      badge: "Premium",
    },
    {
      icon: BarChart3,
      title: "Nutritional Analytics",
      description:
        "Comprehensive nutritional breakdowns with macro and micronutrient tracking to optimize your health.",
      badge: "Health Focus",
    },
    {
      icon: Clock,
      title: "Time-Saving Automation",
      description: "Automatically generate weekly meal plans and shopping lists in seconds, not hours.",
      badge: "Efficiency",
    },
    {
      icon: Heart,
      title: "Health Goal Tracking",
      description: "Set and track health goals like weight loss, muscle gain, or maintaining a balanced diet.",
      badge: "Wellness",
    },
    {
      icon: Users,
      title: "Family-Friendly Planning",
      description: "Create meal plans that accommodate multiple family members with different dietary needs.",
      badge: "Family",
    },
    {
      icon: Shield,
      title: "Dietary Restrictions",
      description: "Support for all dietary preferences including vegan, keto, gluten-free, and custom restrictions.",
      badge: "Inclusive",
    },
    {
      icon: Zap,
      title: "Instant Recipe Generation",
      description: "Generate new recipes instantly based on ingredients you have or want to try.",
      badge: "Quick",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need for
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              Smart Meal Planning
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover powerful features designed to transform how you plan, prepare, and enjoy your meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-primary/10 rounded-lg p-2 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
