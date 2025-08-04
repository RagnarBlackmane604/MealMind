"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export function Pricing() {
  const { data: session } = useSession();
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out MealMind",
      features: [
        "2 AI-generated meal plans per month",
        "2 AI-generated recipes per month",
        "Basic nutritional information",
        "Mobile-friendly interface",
        "Community support",
      ],
      limitations: [
        "No AI-generated images",
        "Limited meal plan customization",
        "Basic recipe suggestions",
      ],
      cta: "Current Plan",
      popular: false,
      icon: Star,
      current: session?.user?.subscription === "free",
    },
    {
      id: "premium",
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "Unlimited access to core features",
      features: [
        "Unlimited AI meal plans",
        "Unlimited AI recipes",
        "AI-generated food images",
        "Advanced nutritional analytics",
        "Custom dietary restrictions",
        "Family meal planning",
        "Shopping list generation",
        "Export meal plans (PDF)",
        "Priority support",
        "Early access to new features",
      ],
      limitations: [],
      cta: "Upgrade to Premium",
      popular: true,
      icon: Zap,
      current: session?.user?.subscription === "premium",
    },
    {
      id: "business",
      name: "Business",
      price: "$29.99",
      period: "per month",
      description: "For nutritionists and meal planning professionals",
      features: [
        "Everything in Premium",
        "Client management dashboard",
        "Bulk meal plan generation",
        "White-label options",
        "API access",
        "Advanced analytics",
        "Team collaboration",
        "Custom branding",
        "Dedicated support",
        "Training sessions",
      ],
      limitations: [],
      cta: "Upgrade to Business",
      popular: false,
      icon: Crown,
      current: session?.user?.subscription === "business",
    },
  ];

  const handleUpgrade = async (planId: string) => {
    if (!session?.user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    setIsUpgrading(planId);
    try {
      const response = await fetch("/api/user/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        throw new Error("Failed to upgrade plan");
      }

      toast({
        title: "Plan upgraded!",
        description: `You've successfully upgraded to ${planId}.`,
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(null);
    }
  };

  return (
    <section className="py-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`relative group hover:shadow-xl transition-all duration-300 ${
              plan.popular
                ? "border-primary shadow-lg scale-105"
                : "hover:border-primary/50 hover:-translate-y-1"
            } ${plan.current ? "ring-2 ring-primary" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  Most Popular
                </Badge>
              </div>
            )}

            {plan.current && (
              <div className="absolute -top-4 right-4">
                <Badge variant="outline" className="bg-background">
                  Current Plan
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div
                  className={`rounded-full p-3 ${
                    plan.popular
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <plan.icon className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">
                  /{plan.period}
                </span>
              </div>
              <CardDescription className="mt-2 text-base">
                {plan.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-2">
                    Not included:
                  </p>
                  <div className="space-y-2">
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center">
                        <div className="h-4 w-4 mr-3 flex-shrink-0">
                          <div className="h-1 w-3 bg-muted-foreground/40 rounded"></div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {plan.current ? (
                <Button
                  className="w-full bg-transparent"
                  variant="outline"
                  disabled
                >
                  Current Plan
                </Button>
              ) : session?.user ? (
                <LoadingButton
                  className={`w-full transition-all duration-200 ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 hover:scale-105"
                      : "hover:bg-primary/90 hover:scale-105"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleUpgrade(plan.id)}
                  loading={isUpgrading === plan.id}
                  loadingText="Upgrading..."
                >
                  {plan.cta}
                </LoadingButton>
              ) : (
                <Button
                  asChild
                  className={`w-full transition-all duration-200 ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 hover:scale-105"
                      : "hover:bg-primary/90 hover:scale-105"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link href={`/signup?plan=${plan.id}`}>{plan.cta}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          All plans include a 7-day free trial. No credit card required for the
          free plan.
        </p>
      </div>
    </section>
  );
}
