import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { cookies } from "next/headers";

// Middleware equivalent to verify admin
function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await request.json();
    
    // Find first settings doc and update, or create if none exists
    const settings = await Settings.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
