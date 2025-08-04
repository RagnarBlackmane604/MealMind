"use client";

import { useState } from "react";
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
import { ChefHat, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CreateRecipePage() {
  const { data: session } = useSession();
  const token = session?.accessToken; // Passe das ggf. an dein Setup an
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: title }), // oder weitere Felder
      });
      const data = await res.json();
      setTitle(data.title || "");
      setIngredients(data.ingredients || "");
      setInstructions(data.instructions || "");
      toast({
        title: "AI-Generierung erfolgreich!",
        description: "Das Rezept wurde generiert.",
      });
    } catch (error) {
      toast({
        title: "Fehler bei der AI-Generierung",
        description: "Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
          <CardTitle className="text-2xl font-bold">
            Neues Rezept erstellen
          </CardTitle>
          <CardDescription>
            Gib einen Titel und Zutaten ein oder lass die KI ein Rezept
            generieren!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Rezepttitel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          <Textarea
            placeholder="Zutaten (z.B. 2 Eier, 200g Mehl...)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            rows={3}
          />
          <Textarea
            placeholder="Anleitung"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            rows={5}
          />
          <Button
            onClick={handleAIGenerate}
            disabled={isGenerating}
            className="w-full flex items-center gap-2"
            variant="secondary"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "AI generiert..." : "AI Rezept generieren"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
