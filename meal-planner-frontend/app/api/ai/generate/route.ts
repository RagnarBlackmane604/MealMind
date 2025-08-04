import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const apiKey = process.env.GOOGLE_GENERATE_AI_API_KEY;
  const result = await google.chat({
    apiKey: apiKey as string,
    messages: [{ role: "user", content: prompt }],
    model: "gemini-pro",
  } as any);
  return Response.json(result);
}
