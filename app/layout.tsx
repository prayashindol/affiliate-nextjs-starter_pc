import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import ScrollArrowEffect from "./components/ScrollArrowEffect";

export const metadata: Metadata = {
  title: "STR Specialist - Airbnb Host Resources",
  description:
    "Your central reliable resource for essential tools, templates, and training to maximize your hosting success",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white font-sans">
        <UserProvider>
          <CartProvider>
            <Header />
            <ScrollArrowEffect /> {/* <-- Add this here! */}
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
