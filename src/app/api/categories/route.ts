import { NextResponse } from "next/server";
import { getCategoriesFromDb } from "@/lib/services/articles";

export async function GET() {
  try {
    const categories = await getCategoriesFromDb();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("API /api/categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
