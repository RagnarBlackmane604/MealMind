import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const res = await fetch(`http://localhost:3001/meal-plans/${id}`, {
    headers: {
      Authorization: req.headers.get("authorization") || "",
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `MealPlan not found (status ${res.status})` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const res = await fetch(`http://localhost:3001/meal-plans/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: req.headers.get("authorization") || "",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const res = await fetch(`http://localhost:3001/meal-plans/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: req.headers.get("authorization") || "",
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
