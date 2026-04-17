export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Blog from "@/backend/models/Blog";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    await dbConnect();
    const body = await req.json();
    const blog = await Blog.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    await dbConnect();
    await Blog.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
