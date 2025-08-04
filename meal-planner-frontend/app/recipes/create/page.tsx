"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function CreateRecipePage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiRecipe, setAiRecipe] = useState<{
    title: string;
    ingredients: string[];
    instructions: string[];
  } | null>(null);
  const [mealPlanId, setMealPlanId] = useState<string | undefined>(undefined);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const { toast } = useToast();
  const { data: session } = useSession();

  // MealPlans laden
  useEffect(() => {
    async function fetchMealPlans() {
      const res = await fetch("/api/mealplans", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMealPlans(data);
      }
    }
    if (session?.accessToken) fetchMealPlans();
  }, [session?.accessToken]);

  async function handleGenerate() {
    setIsGenerating(true);
    setAiRecipe(null);
    try {
      const body: any = { prompt };
      if (mealPlanId) {
        body.mealPlanId = mealPlanId;
      }
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "AI generation failed",
          description: data.error || "Unknown error",
          variant: "destructive",
        });
        return;
      }
      setAiRecipe(data.recipe);
      toast({
        title: "AI recipe generated!",
        description: "The recipe was created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "AI generation failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            Create AI Recipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleGenerate();
            }}
          >
            <Textarea
              placeholder="Describe your desired recipe (e.g. 'Vegetarian curry with rice')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              required
            />
            <select
              value={mealPlanId || ""}
              onChange={(e) => setMealPlanId(e.target.value || undefined)}
              className="w-full border rounded p-2"
            >
              <option value="">No Meal Plan</option>
              {mealPlans.map((mp) => (
                <option key={mp._id} value={mp._id}>
                  {mp.title}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-lg py-3 rounded-lg shadow-lg hover:scale-[1.03] transition-transform"
              disabled={isGenerating || !prompt}
            >
              <Sparkles className="h-5 w-5" />
              {isGenerating ? "Generating ..." : "Generate with AI"}
            </Button>
          </form>
          {aiRecipe && (
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-2">{aiRecipe.title}</h3>
              <div className="mb-2">
                <span className="font-semibold">Ingredients:</span>
                <ul className="list-disc ml-6">
                  {aiRecipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Instructions:</span>
                <ol className="list-decimal ml-6">
                  {aiRecipe.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
              <Button
                onClick={async () => {
                  await fetch("/api/recipes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(aiRecipe),
                  });
                  toast({ title: "Recipe saved!" });
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2 rounded-lg shadow-md hover:bg-green-600 transition-colors"
              >
                Save Recipe
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
