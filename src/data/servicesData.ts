import { CalendarRange, Heart, Home, Briefcase, Radio, Film, Smartphone, Camera, LucideIcon } from 'lucide-react';

export interface Subcategory {
  id: string;
  title: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  subcategories: Subcategory[];
}

export const servicesData: ServiceCategory[] = [
  {
    id: "event-photography",
    title: "Event Photography & Videography",
    description: "Comprehensive coverage for all your important events, from corporate gatherings to private celebrations.",
    icon: CalendarRange,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop",
    subcategories: [
      { id: "corporate-event", title: "Corporate event" },
      { id: "trade-show", title: "Trade Show & Exhibition" },
      { id: "social-private", title: "Social & Private Celebration" },
      { id: "educational-event", title: "Educational Event" },
      { id: "birthday-proposal", title: "Birthday & love Proposal" }
    ]
  },
  {
    id: "wedding",
    title: "Wedding",
    description: "Capturing the magic and emotion of your special day with elegant photography and cinematic videography.",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    subcategories: [
      { id: "pre-wedding", title: "Pre-wedding" },
      { id: "wedding-day", title: "Wedding" }
    ]
  },
  {
    id: "real-estate",
    title: "Real Estate",
    description: "High-quality visual content that showcases properties in their best light to attract buyers.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
    subcategories: [
      { id: "interior-architecture", title: "Interior and architecture" },
      { id: "reel-content", title: "Reel Content" }
    ]
  },
  {
    id: "brand-business",
    title: "Brand & Business",
    description: "Professional imagery designed to elevate your brand identity and corporate presence.",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1664575602276-cd0758ae7f61?q=80&w=2070&auto=format&fit=crop",
    subcategories: [
      { id: "product-photography", title: "Product Photography" },
      { id: "portraits-headshot", title: "Portraits & Headshot" },
      { id: "industrial-photography", title: "Industrial Photography" },
      { id: "fashion-photography", title: "Fashion Photography" }
    ]
  },
  {
    id: "live-streaming",
    title: "Live streaming & broadcasting",
    description: "Seamless, high-quality live streaming services to connect your event with a global audience.",
    icon: Radio,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop",
    subcategories: [
      { id: "corporate-event", title: "Corporate event" },
      { id: "conference-seminars", title: "Conference & Seminars" },
      { id: "wedding-special", title: "Wedding & special Occasion" },
      { id: "concert-festivals", title: "Concert & festivals" },
      { id: "sports-event", title: "Sports event" }
    ]
  },
  {
    id: "video-production",
    title: "Video production",
    description: "Full-scale video production services crafting compelling stories for businesses and personal brands.",
    icon: Film,
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop",
    subcategories: [
      { id: "short-films", title: "Short / Documentary films" },
      { id: "music-video", title: "Music Video" },
      { id: "youtube-podcast", title: "YouTube & podcast video" },
      { id: "brand-business", title: "Brand & business" },
      { id: "company-profile", title: "Company profile film" },
      { id: "office-warehouse", title: "Office & warehouse film" },
      { id: "product-video", title: "Product video" }
    ]
  },
  {
    id: "social-media",
    title: "Social media content",
    description: "Engaging, platform-optimized visual content to grow your online presence and audience.",
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop",
    subcategories: [
      { id: "short-form", title: "Short form video" },
      { id: "user-generated", title: "User generated content" },
      { id: "interactive-content", title: "Interactive content" },
      { id: "education-video", title: "Education video" },
      { id: "image-graphical", title: "Image & Graphical video" },
      { id: "text-posts", title: "Text based posts" }
    ]
  },
  {
    id: "photobooth",
    title: "Photobooth",
    description: "Interactive and fun photobooth experiences to entertain guests and capture memories.",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop",
    subcategories: [
      { id: "magic-mirror", title: "The magic mirror" },
      { id: "360-degree", title: "360 degree videobooth" },
      { id: "magazine-photobooth", title: "The magazine photobooth" },
      { id: "instant-printing", title: "Instant printing photobooth" },
      { id: "classic-photobooth", title: "Classic photobooth" }
    ]
  }
];
