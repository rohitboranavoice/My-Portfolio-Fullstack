"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  Briefcase, 
  Camera, 
  LogOut, 
  User, 
  Home, 
  Mail, 
  MessageSquare, 
  FileText,
  Newspaper,
  Film
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Hero Section", href: "/admin/hero", icon: Home },
    { name: "About Me", href: "/admin/about", icon: User },
    { name: "Portfolio", href: "/admin/portfolio", icon: Camera },
    { name: "Videography", href: "/admin/videography", icon: Film },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Blog Posts", href: "/admin/blogs", icon: Newspaper },
    { name: "Resume", href: "/admin/resume", icon: FileText },
    { name: "Contact Info", href: "/admin/contact", icon: Mail },
    { name: "General Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-[100vh]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1D2939] text-white flex flex-col fixed h-full z-10">
        <div className="p-6">
          <Link href="/admin" className="font-bold text-xl tracking-wider">
            RB <span className="text-[#FD853A]">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 mt-6">
          <ul className="flex flex-col gap-2 px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? "bg-[#FD853A] text-white font-semibold" 
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-[#F9FAFB] min-h-screen">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
