import dbConnect from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const latestResume = await Resume.findOne().sort({ createdAt: -1 });
    
    if (!latestResume) {
      // Fallback/Mock URL for demonstration if no resume exists in DB yet
      return NextResponse.json({ 
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" 
      });
    }

    return NextResponse.json(latestResume);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
