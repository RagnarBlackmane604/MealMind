import { NextRequest, NextResponse } from "next/server";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${apiBaseUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    return new NextResponse(JSON.stringify(data), {
      status: backendRes.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error forwarding signup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
