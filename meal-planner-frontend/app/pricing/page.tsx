import { Pricing } from "@/components/pricing-section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function PricingPage() {
  const features = [
    {
      feature: "AI-generated meal plans",
      free: "2 per month",
      premium: "Unlimited",
    },
    {
      feature: "AI-generated recipes",
      free: "2 per month",
      premium: "Unlimited",
    },
    {
      feature: "AI-generated food images",
      free: false,
      premium: true,
    },
    {
      feature: "Basic nutritional information",
      free: true,
      premium: true,
    },
    {
      feature: "Advanced nutritional analytics",
      free: false,
      premium: true,
    },
    {
      feature: "Custom dietary restrictions",
      free: "Basic",
      premium: "Advanced",
    },
    {
      feature: "Family meal planning",
      free: false,
      premium: true,
    },
    {
      feature: "Shopping list generation",
      free: false,
      premium: true,
    },
    {
      feature: "Export meal plans (PDF)",
      free: false,
      premium: true,
    },
    {
      feature: "Priority support",
      free: false,
      premium: true,
    },
    {
      feature: "Early access to new features",
      free: false,
      premium: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              Perfect Plan
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and upgrade when you're ready for unlimited AI-powered
            meal planning.
          </p>
        </div>

        <Pricing />

        {/* Feature Comparison */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Feature Comparison
          </h2>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Compare Plans</CardTitle>
              <CardDescription>
                See what's included in each plan to make the best choice for
                your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">
                        Feature
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Free
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Premium
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">{item.feature}</td>
                        <td className="py-3 px-4 text-center">
                          {typeof item.free === "boolean" ? (
                            item.free ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{item.free}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof item.premium === "boolean" ? (
                            item.premium ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm">{item.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Can I upgrade or downgrade my plan anytime?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can upgrade to Premium anytime to unlock unlimited
                  features. If you downgrade, you'll retain access to Premium
                  features until your current billing period ends.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  What happens when I reach my free plan limits?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Once you've used your 2 meal plans and 2 recipes for the
                  month, you'll need to upgrade to Premium to generate more
                  content. Your existing plans and recipes will always remain
                  accessible.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Are AI-generated images really only for Premium users?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, AI-generated food images require significant
                  computational resources, so they're exclusive to Premium
                  subscribers. Free users will see placeholder images instead.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Is there a free trial for Premium?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! All new users get a 7-day free trial of Premium features
                  when they sign up. No credit card required to start your
                  trial.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
