import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("API GET Projects failed:", error);
    return NextResponse.json([]); // Return empty array to prevent frontend crash
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    
    // Assign order to be last
    const count = await Project.countDocuments();
    const newProject = await Project.create({
      ...data,
      order: count,
    });
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
