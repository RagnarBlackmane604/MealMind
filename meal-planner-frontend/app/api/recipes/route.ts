import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const res = await fetch("http://localhost:3001/recipes", {
    headers: {
      Authorization: req.headers.get("authorization") || "",
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
