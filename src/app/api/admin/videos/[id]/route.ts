import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Video from "@/models/Video";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    const updatedVideo = await Video.findByIdAndUpdate(params.id, data, { new: true });
    
    if (!updatedVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedVideo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const deletedVideo = await Video.findByIdAndDelete(params.id);
    
    if (!deletedVideo) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
