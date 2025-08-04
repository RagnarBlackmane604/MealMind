import { NextRequest, NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const backendUrl = `${apiBaseUrl}/auth/verify?token=${token}`;

  try {
    const backendResponse = await fetch(backendUrl, {
      method: "GET",
    });

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
