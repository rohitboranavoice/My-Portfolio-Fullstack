export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Project from "@/backend/models/Project";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    const updatedProject = await Project.findByIdAndUpdate(params.id, data, { new: true });
    
    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const deletedProject = await Project.findByIdAndDelete(params.id);
    
    if (!deletedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
