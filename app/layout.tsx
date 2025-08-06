import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import React, { useEffect } from "react";


// Add Inter font (Google) globally
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "STR Specialist - Airbnb Host Resources",
  description:
    "Your central reliable resource for essential tools, templates, and training to maximize your hosting success",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    function updateScrollArrows() {
      document.querySelectorAll('.prose .overflow-x-auto').forEach(el => {
        el.classList.remove('show-scroll-arrow');
        if ((el as HTMLElement).scrollWidth > (el as HTMLElement).clientWidth + 2) {
          el.classList.add('show-scroll-arrow');
        }
      });
    }
    updateScrollArrows();
    window.addEventListener('resize', updateScrollArrows);

    // Optional: rerun when user navigates (Next.js app router only)
    // If you use client-side navigation and new content, you may want to
    // listen for navigation events and re-run the function.
    return () => window.removeEventListener('resize', updateScrollArrows);
  }, []);

  return <>{children}</>;
}


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white font-sans">
        <UserProvider>
          <CartProvider>
            <Header />
              <div className="container mx-auto px-4 max-w-6xl">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
