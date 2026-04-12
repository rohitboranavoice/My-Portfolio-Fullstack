import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";
import { cookies } from "next/headers";

function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const { items } = await request.json(); // Array of { id, order }

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Bulk update the orders
    const promises = items.map(item => 
      Project.findByIdAndUpdate(item.id, { order: item.order })
    );
    
    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder failed:", error);
    return NextResponse.json({ error: "Failed to reorder projects" }, { status: 500 });
  }
}
