import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = await fetch("http://localhost:3001/meal-plans", {
    headers: {
      Authorization: req.headers.get("authorization") || "",
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch("http://localhost:3001/meal-plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("authorization") || "",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
