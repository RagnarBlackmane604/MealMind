import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Authorization Header:", req.headers.get("authorization")); // <-- HIER!
    const { mealPlanId } = await req.json();

    // 1. MealPlan-Daten holen
    const mealPlanRes = await fetch(
      `http://localhost:3001/meal-plans/${mealPlanId}`,
      {
        headers: {
          Authorization: req.headers.get("authorization") || "",
        },
      }
    );
    if (!mealPlanRes.ok) {
      return NextResponse.json(
        { message: "MealPlan not found" },
        { status: mealPlanRes.status }
      );
    }
    const mealPlanData = await mealPlanRes.json();

    // 2. Prompt für Gemini bauen
    const prompt = `
      Create a creative recipe for the following meal plan:
      Title: ${mealPlanData.title}
      Goal: ${mealPlanData.goal}
      Period: ${mealPlanData.startDate} to ${mealPlanData.endDate}
      Diet: ${(mealPlanData.diet || []).join(", ")}
      Allergies: ${mealPlanData.allergies || "None"}
      Notes: ${mealPlanData.notes || "None"}
      Existing recipes: ${(mealPlanData.recipes || []).length}
      Please return the recipe as JSON with fields: title, ingredients (array), instructions (array).
    `;

    // 3. Call an dein Backend, Prompt mitsenden
    const res = await fetch("http://localhost:3001/recipes/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("authorization") || "",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Recipe generation failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { message: "Error generating recipe" },
      { status: 500 }
    );
  }
}

// Optional: Disallow other methods
export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
export function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
export function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
