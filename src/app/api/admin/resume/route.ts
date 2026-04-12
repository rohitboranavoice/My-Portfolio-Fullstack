import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET() {
  try {
    await dbConnect();
    const resume = await Resume.findOne({}).sort({ createdAt: -1 });
    return NextResponse.json(resume || { pdfUrl: "" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthenticated()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    await dbConnect();
    const body = await req.json();
    const resume = await Resume.findOneAndUpdate({}, body, { upsert: true, new: true });
    return NextResponse.json(resume);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}
