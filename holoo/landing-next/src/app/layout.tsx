import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/ui/footer";
import { Navbar1 } from "@/components/ui/navbar-1";
import { Github, Twitter } from "lucide-react";
import "./globals.css";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Holo",
  description: "Predictive intelligence for e-commerce",
  icons: {
    icon: "/favicon.svg",
  },
};

const menuItems = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Features", url: "/features" },
  { id: 3, title: "Pricing", url: "/pricing" },
  { id: 4, title: "About", url: "/about" },
  { id: 5, title: "Contact", url: "/contact" }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <Navbar1 />
        <main className="flex-1">
          {children}
        </main>
        <Footer
          copyright={{
            text: "© 2025 Holo. All rights reserved."
          }}
        />
        <Toaster />
      </body>
    </html>
  );
}
