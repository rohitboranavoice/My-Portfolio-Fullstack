import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({}).sort({ order: 1 });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("API GET Testimonials failed:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const testimonial = await Testimonial.create(body);
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
