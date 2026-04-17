export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Video from "@/backend/models/Video";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("API GET Videos failed:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    console.log("Creating video with data:", data);

    // Sanitize data: remove empty _id to avoid Mongoose validation failure for new objects
    if (data._id === "") delete data._id;
    // Assign order to be last
    const count = await Video.countDocuments();
    const newVideo = await Video.create({
      ...data,
      order: count,
    });
    
    return NextResponse.json(newVideo, { status: 201 });
  } catch (error: any) {
    console.error("API POST Video failed:", error);
    return NextResponse.json({ error: "Failed to create video", details: error.message }, { status: 500 });
  }
}

