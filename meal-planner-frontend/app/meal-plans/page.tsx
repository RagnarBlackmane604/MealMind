"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, ChefHat } from "lucide-react";
import { ImageUploadButton } from "@/components/ImageUploadButton";
import { useToast } from "@/hooks/use-toast"; // falls du ein Toast nutzt

type MealPlan = {
  _id: string;
  title: string;
  goal: string;
  startDate: string;
  endDate: string;
  recipes?: any[];
  image?: string;
};

export default function MealPlansPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [imageUrls, setImageUrls] = useState<{ [id: string]: string }>({});
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMealPlans() {
      const res = await fetch("http://localhost:3001/meal-plans", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken
            ? `Bearer ${session.accessToken}`
            : "",
        },
      });
      const data = await res.json();
      // Prüfe, ob die Antwort ein Array ist oder ein Objekt mit Array
      if (Array.isArray(data)) {
        setMealPlans(data);
      } else if (Array.isArray(data.mealPlans)) {
        setMealPlans(data.mealPlans);
      } else if (Array.isArray(data.data)) {
        setMealPlans(data.data);
      } else {
        setMealPlans([]);
      }
    }
    fetchMealPlans();
  }, [session]);

  const handleGenerateRecipe = async (mealPlanId: string) => {
    try {
      const res = await fetch(`/api/recipes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken
            ? `Bearer ${session.accessToken}`
            : "",
        },
        body: JSON.stringify({ mealPlanId }),
      });
      if (!res.ok) throw new Error("Fehler beim Generieren");
      const data = await res.json();
      toast({
        title: "Rezept erstellt!",
        description: `Das Rezept "${data.title}" wurde erstellt.`,
      });
      // Optional: MealPlans oder Rezepte neu laden
    } catch (e) {
      toast({
        title: "Fehler",
        description: "Das Rezept konnte nicht erstellt werden.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            Meal Plans
          </h1>
          <Button asChild className="flex items-center gap-2">
            <Link href="/meal-plans/create">
              <Plus className="h-5 w-5" />
              New Meal Plan
            </Link>
          </Button>
        </div>
        <div className="grid gap-6">
          {mealPlans.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              Noch keine Meal Plans vorhanden.
            </div>
          ) : (
            mealPlans.map((plan) => (
              <Card
                key={plan._id}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {plan.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="mb-2">
                      <span className="font-semibold">Goal:</span> {plan.goal}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Period:</span>{" "}
                      {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                    </div>
                    <div>
                      <span className="font-semibold">Recipes:</span>{" "}
                      {plan.recipes ? plan.recipes.length : 0}
                    </div>
                  </div>
                  <ImageUploadButton
                    onUpload={(url) => {
                      console.log(
                        "Cloudinary URL: https://res.cloudinary.com/",
                        url
                      );
                      setImageUrls((prev) => ({ ...prev, [plan._id]: url }));
                    }}
                  />
                  {imageUrls[plan._id] && (
                    <img
                      src={imageUrls[plan._id]}
                      alt="Mealplan"
                      className="mt-4 rounded-lg max-h-48"
                    />
                  )}
                  {plan.image && (
                    <img
                      src={plan.image}
                      alt={plan.title}
                      className="mt-4 rounded-lg max-h-48"
                    />
                  )}
                  <Button
                    className="mt-4 bg-gradient-to-r from-green-500 via-green-400 to-green-600 text-white font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 border-2 border-green-600"
                    onClick={() => handleGenerateRecipe(plan._id)}
                  >
                    <span className="animate-pulse">
                      <ChefHat className="h-5 w-5 text-white drop-shadow" />
                    </span>
                    <span className="tracking-wide">
                      Generate Recipe with AI
                    </span>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("de-DE", options);
}
