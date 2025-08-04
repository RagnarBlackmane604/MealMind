import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { z } from "zod";

const upgradeSchema = z.object({
  planId: z.enum(["free", "premium", "business"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    console.log("Session:", session);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = upgradeSchema.parse(body);

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/upgrade`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          userId: session.user.id,
          planId,
        }),
      }
    );

    const data = await backendRes.json();

    return new NextResponse(JSON.stringify(data), {
      status: backendRes.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Upgrade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
