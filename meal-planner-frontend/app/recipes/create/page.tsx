"use client";
import { useState } from "react";
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
  const { toast } = useToast();
  const { data: session } = useSession();

  async function handleGenerate() {
    setIsGenerating(true);
    setAiRecipe(null);
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({
          title: "Fehler bei AI-Generierung",
          description: data.error || "Unbekannter Fehler",
          variant: "destructive",
        });
        return;
      }
      setAiRecipe(data.recipe);
      toast({
        title: "AI-Rezept generiert!",
        description: "Das Rezept wurde erfolgreich erstellt.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler bei AI-Generierung",
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
            AI Rezept erstellen
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
              placeholder="Beschreibe dein Wunschrezept (z.B. 'Vegetarisches Curry mit Reis')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              required
            />
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white font-bold text-lg py-3 rounded-lg shadow-lg hover:scale-[1.03] transition-transform"
              disabled={isGenerating || !prompt}
            >
              <Sparkles className="h-5 w-5" />
              {isGenerating ? "Generiere ..." : "Mit AI generieren"}
            </Button>
          </form>
          {aiRecipe && (
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-2">{aiRecipe.title}</h3>
              <div className="mb-2">
                <span className="font-semibold">Zutaten:</span>
                <ul className="list-disc ml-6">
                  {aiRecipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold">Zubereitung:</span>
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
                  toast({ title: "Rezept gespeichert!" });
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-2 rounded-lg shadow-md hover:bg-green-600 transition-colors"
              >
                Rezept speichern
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
