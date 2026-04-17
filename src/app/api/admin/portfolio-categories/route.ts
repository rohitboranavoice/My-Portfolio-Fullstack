export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import PortfolioCategory from "@/backend/models/PortfolioCategory";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET() {
  try {
    await dbConnect();
    const categories = await PortfolioCategory.find({}).sort({ order: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    await dbConnect();
    const body = await req.json();
    
    // Auto-generate slug if not provided
    if (!body.slug) {
      body.slug = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    const category = await PortfolioCategory.create(body);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

