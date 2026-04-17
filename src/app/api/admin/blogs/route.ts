export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Blog from "@/backend/models/Blog";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    await dbConnect();
    const body = await req.json();
    const blog = await Blog.create(body);
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

