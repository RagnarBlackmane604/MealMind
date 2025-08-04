"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Calendar, Plus, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import type { Session } from "next-auth";

type MealPlan = {
  _id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  recipes?: any[];
  image?: string;
};
type Recipe = {
  _id: string;
  title: string;
  ingredients?: string[];
  instructions?: string[];
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { mealPlans } = useSelector((state: RootState) => state.mealPlan);
  const { recipes } = useSelector((state: RootState) => state.recipe);
  const [fetchedMealPlans, setFetchedMealPlans] = useState<MealPlan[]>([]);
  const [fetchedRecipes, setFetchedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchMealPlans() {
      if (session?.accessToken) {
        const res = await fetch("/api/meal-plans", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const data = await res.json();
        // Prüfe, ob die Antwort ein Array ist oder ein Objekt mit Array
        if (Array.isArray(data)) {
          setFetchedMealPlans(data);
        } else if (Array.isArray(data.mealPlans)) {
          setFetchedMealPlans(data.mealPlans);
        } else if (Array.isArray(data.data)) {
          setFetchedMealPlans(data.data);
        } else {
          setFetchedMealPlans([]);
        }
      }
    }

    fetchMealPlans();
  }, [session]);

  useEffect(() => {
    async function fetchRecipes() {
      if (session?.accessToken) {
        const res = await fetch("/api/recipes", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setFetchedRecipes(data);
        } else if (Array.isArray(data.recipes)) {
          setFetchedRecipes(data.recipes);
        } else if (Array.isArray(data.data)) {
          setFetchedRecipes(data.data);
        } else {
          setFetchedRecipes([]);
        }
      }
    }
    fetchRecipes();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session?.accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to access your dashboard
          </h1>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const user = session.user;
  const mealPlanLimit = user.plan === "free" ? 2 : Number.POSITIVE_INFINITY;
  const recipeLimit = user.plan === "free" ? 2 : Number.POSITIVE_INFINITY;
  const mealPlanProgress =
    user.plan === "free"
      ? (session.user.mealPlansUsed ?? 0 / mealPlanLimit) * 100
      : 0;
  const recipeProgress =
    user.plan === "free"
      ? (session.user.recipesUsed ?? 0 / recipeLimit) * 100
      : 0;

  console.log("Redux MealPlans:", mealPlans);
  console.log("Redux Recipes:", recipes);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back
                {session?.user?.name ? `, ${session.user.name}` : ""}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Let's create something delicious today
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant={user.plan === "premium" ? "default" : "secondary"}
              >
                {user.plan === "premium" ? "Premium" : "Free Plan"}
              </Badge>
              {user.plan === "free" && (
                <Button asChild size="sm">
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Generate Meal Plan */}
          <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Generate Meal Plan
              </CardTitle>
              <CardDescription>
                Create a personalized meal plan based on your preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full group-hover:bg-primary/90 transition-colors mt-5"
              >
                <Link href="/meal-plans/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Plan
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Generate Recipe */}
          <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <ChefHat className="h-5 w-5 mr-2 text-primary" />
                Generate Recipe
              </CardTitle>
              <CardDescription>
                Get AI-generated recipes tailored to your taste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full group-hover:bg-primary/90 transition-colors mt-5"
              >
                <Link href="/recipes/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Recipe
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Usage Stats */}
        {user.plan === "free" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Meal Plans
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {user.mealPlansUsed}/{mealPlanLimit}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={mealPlanProgress} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {mealPlanLimit - (user.mealPlansUsed ?? 0)} meal plans
                  remaining
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <ChefHat className="h-5 w-5 mr-2" />
                    Recipes
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {user.recipesUsed}/{recipeLimit}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={recipeProgress} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {recipeLimit - (user.recipesUsed ?? 0)} recipes remaining
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Meal Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fetchedMealPlans.length > 0 ? (
                <div className="space-y-3">
                  {fetchedMealPlans.slice(0, 3).map((plan) => (
                    <Card
                      key={plan._id}
                      className="flex items-center gap-4 p-4"
                    >
                      {plan.image && (
                        <img
                          src={plan.image}
                          alt={plan.title}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-bold">{plan.title}</div>
                        {/* more Infos */}
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/meal-plans/${plan._id}`}>View</Link>
                      </Button>
                    </Card>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link href="/meal-plans">View All Plans</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No meal plans yet
                  </p>
                  <Button asChild>
                    <Link href="/meal-plans/create">
                      Create Your First Plan
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChefHat className="h-5 w-5 mr-2" />
                Recent Recipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fetchedRecipes.length > 0 ? (
                <div className="space-y-3">
                  {fetchedRecipes.slice(0, 3).map((recipe) => (
                    <div
                      key={recipe._id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{recipe.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {recipe.ingredients ? recipe.ingredients.length : 0}{" "}
                          ingredients
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/recipes/${recipe._id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link href="/recipes">View All Recipes</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No recipes yet</p>
                  <Button asChild>
                    <Link href="/recipes/create">
                      Generate Your First Recipe
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
