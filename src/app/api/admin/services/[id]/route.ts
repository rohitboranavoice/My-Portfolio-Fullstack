export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import dbConnect from "@/backend/lib/mongodb";
import Service from "@/backend/models/Service";
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
    const updatedService = await Service.findByIdAndUpdate(params.id, data, { new: true });
    
    if (!updatedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedService);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const deletedService = await Service.findByIdAndDelete(params.id);
    
    if (!deletedService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
