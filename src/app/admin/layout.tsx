"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Briefcase, 
  Camera, 
  LogOut, 
  User, 
  Home, 
  Mail, 
  MessageSquare, 
  Newspaper,
  Film,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
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
    { name: "Contact Info", href: "/admin/contact", icon: Mail },
  ];

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#F9FAFB]">{children}</div>;
  }

  return (
    <div className="flex min-h-[100vh]">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1D2939] text-white flex items-center justify-between px-4 z-40 shadow-md">
        <Link href="/admin" className="font-bold text-lg tracking-wider">
          RB <span className="text-[#FD853A]">ADMIN</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1D2939] text-white flex flex-col 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:h-screen
      `}>
        <div className="p-6 flex justify-between items-center">
          <Link href="/admin" className="font-bold text-xl tracking-wider">
            RB <span className="text-[#FD853A]">ADMIN</span>
          </Link>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        <nav className="flex-1 mt-2 overflow-y-auto hidden-scrollbar">
          <ul className="flex flex-col gap-2 px-4 pb-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
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

        <div className="p-6 border-t border-white/10 mt-auto">
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
      <main className="flex-1 bg-[#F9FAFB] min-h-screen w-full md:w-auto mt-16 md:mt-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto overflow-x-hidden">
          {children}
        </div>
      </main>

      <style jsx global>{`
        .hidden-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hidden-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
