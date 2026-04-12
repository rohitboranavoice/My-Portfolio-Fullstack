import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({}).sort({ order: 1 });
    return NextResponse.json(services);
  } catch (error) {
    console.error("API GET Services failed:", error);
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
    
    const count = await Service.countDocuments();
    const newService = await Service.create({
      ...data,
      order: count,
    });
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
