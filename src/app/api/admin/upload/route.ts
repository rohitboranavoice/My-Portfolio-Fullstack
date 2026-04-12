import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Function to check if authenticated
function isAuthenticated() {
  const session = cookies().get("admin_session")?.value;
  return session === "authenticated";
}

export async function POST(request: Request) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create safe filename
    const filename = Date.now() + "-" + file.name.replace(/\s+/g, '-');
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure uploads directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL path
    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
