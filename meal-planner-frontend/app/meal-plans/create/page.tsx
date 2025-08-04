"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChefHat } from "lucide-react";
import { ImageUploadButton } from "@/components/ImageUploadButton";

const DIETS = [
  "vegetarian",
  "vegan",
  "low-carb",
  "high-protein",
  "gluten-free",
  "lactose-free",
];

export default function CreateMealPlanPage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [diet, setDiet] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recipes, setRecipes] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDietChange = (dietType: string) => {
    setDiet((prev) =>
      prev.includes(dietType)
        ? prev.filter((d) => d !== dietType)
        : [...prev, dietType]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session?.accessToken
            ? `Bearer ${session.accessToken}`
            : "",
        },
        body: JSON.stringify({
          title,
          goal,
          startDate,
          endDate,
          image: imageUrl,
          recipes,
          diet,
          allergies,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Fehler beim Speichern");
      }
      toast({
        title: "Meal Plan erstellt!",
        description: "Deine Präferenzen wurden gespeichert.",
      });
      setTitle("");
      setDiet([]);
      setAllergies("");
      setNotes("");
    } catch (error) {
      toast({
        title: "Fehler beim Erstellen",
        description: "Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 rounded-full p-3">
              <ChefHat className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Create Meal Plan</CardTitle>
          <CardDescription>
            Enter your dietary preferences and allergies to create a
            personalized plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              placeholder="Meal Plan title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <div className="font-medium mb-2">Dietary preferences</div>
              <div className="flex flex-wrap gap-2">
                {DIETS.map((d) => (
                  <Button
                    key={d}
                    type="button"
                    variant={diet.includes(d) ? "default" : "outline"}
                    onClick={() => handleDietChange(d)}
                    className="capitalize"
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Allergies (e.g. nuts, gluten, lactose...)"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              rows={2}
            />

            <Textarea
              placeholder="Additional notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />

            <Input
              placeholder="Goal (e.g. lose weight, build muscle)"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
            <div className="flex gap-4">
              <Input
                type="date"
                placeholder="Start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-1/2"
              />
              <Input
                type="date"
                placeholder="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-1/2"
              />
            </div>

            <ImageUploadButton onUpload={setImageUrl} />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Mealplan"
                className="mt-4 rounded-lg max-h-48"
              />
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create Meal Plan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD;
process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
