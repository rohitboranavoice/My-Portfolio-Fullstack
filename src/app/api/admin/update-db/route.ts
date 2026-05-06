import { NextResponse } from "next/server";
import { connectToDatabase } from "@/backend/config/db";
import Service from "@/backend/models/Service";

// Capitalize first letter of each word
function titleCase(str: string) {
  return str.toLowerCase().replace(/(?:^|\s|\/|-)\w/g, function(match) {
    return match.toUpperCase();
  });
}

export async function GET() {
  try {
    await connectToDatabase();

    const services = await Service.find({});
    
    for (let service of services) {
      let modified = false;

      if (service.title.toLowerCase().includes('brand') && service.title.toLowerCase().includes('business')) {
        const newSubcats = [
          { title: "Portraits & Headshot" },
          { title: "Industrial Photography" },
          { title: "Fashion Photography" }
        ];

        for (let ns of newSubcats) {
          const exists = service.subcategories.some((s: any) => s.title.toLowerCase() === ns.title.toLowerCase());
          if (!exists) {
            const id = ns.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            service.subcategories.push({ title: ns.title, id });
            modified = true;
          }
        }
      }

      if (service.subcategories && service.subcategories.length > 0) {
        service.subcategories = service.subcategories.map((sub: any) => {
          const newTitle = titleCase(sub.title);
          if (newTitle !== sub.title) {
            modified = true;
            return { id: sub.id, title: newTitle };
          }
          return sub;
        });
      }

      if (modified) {
        await service.save();
        console.log(`Updated service: ${service.title}`);
      }
    }

    return NextResponse.json({ success: true, message: "Database updated" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
