import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_GENERATE_AI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const geminiData = await geminiRes.json();
  console.log("Gemini Response:", geminiData);

  if (
    !geminiData.candidates ||
    !geminiData.candidates[0]?.content?.parts[0]?.text
  ) {
    return NextResponse.json({ error: "AI response missing" }, { status: 500 });
  }

  let recipe: any = null;
  try {
    recipe = JSON.parse(geminiData.candidates[0].content.parts[0].text);
  } catch (e) {
    return NextResponse.json({ error: "AI response invalid" }, { status: 500 });
  }

  return NextResponse.json({ recipe });
}
