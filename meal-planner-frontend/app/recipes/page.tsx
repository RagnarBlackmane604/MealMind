"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

type Recipe = {
  _id: string;
  title: string;
  ingredients: string[];
  steps: string[];
};

export default function RecipesPage() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      if (!session?.accessToken) return;
      const res = await fetch("/api/recipes", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : data.recipes || []);
    }
    fetchRecipes();
  }, [session]);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-primary" />
            Recipes
          </h1>
          <Button asChild className="flex items-center gap-2">
            <Link href="/recipes/create">
              <Plus className="h-5 w-5" />
              Create new recipe
            </Link>
          </Button>
        </div>
        <div className="grid gap-6">
          {recipes.map((recipe, idx) => (
            <Card
              key={recipe._id || idx}
              className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  {recipe.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <span className="font-semibold">Ingredients:</span>
                  <ul className="list-disc ml-6 text-muted-foreground">
                    {(recipe.ingredients ?? []).map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">Instructions:</span>
                  <ol className="list-decimal ml-6 text-muted-foreground">
                    {(recipe.steps ?? []).map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
