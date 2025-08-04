import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

// Add Inter font (Google) globally
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "STR Specialist - Airbnb Host Resources",
  description:
    "Your central reliable resource for essential tools, templates, and training to maximize your hosting success",
};

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
