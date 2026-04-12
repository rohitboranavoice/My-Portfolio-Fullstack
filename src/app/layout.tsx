import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { NavbarProvider } from "@/context/NavbarContext";
import { DataProvider } from "@/context/DataContext";

const inter = Inter({ subsets: ["latin"] });
const lato = Lato({ 
  subsets: ["latin"], 
  weight: ["400", "700", "900"],
  variable: "--font-lato" 
});

export const metadata: Metadata = {
  title: "Rohit Borana | Premium Photographer & Videographer",
  description: "Official portfolio of Rohit Borana, capturing life's most precious moments with a cinematic and storytelling approach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} ${lato.variable} antialiased min-h-screen flex flex-col bg-white overflow-x-hidden`}
      >
        <DataProvider>
          <NavbarProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </NavbarProvider>
          <Footer />
          <WhatsAppButton />
        </DataProvider>
      </body>
    </html>
  );
}
