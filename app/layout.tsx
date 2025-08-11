import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { SessionProvider } from "./components/SessionProvider";
import ScrollArrowEffect from "./components/ScrollArrowEffect";
import { ScrollToTopButton } from "./components/ScrollToTopButton";

// Prefer explicit NEXT_PUBLIC_SITE_URL; else use Vercel preview hostname; else localhost
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const ENV = process.env.VERCEL_ENV || process.env.NODE_ENV || "development";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Avoid indexing previews
  robots: ENV === "production" ? undefined : { index: false, follow: false },
  title: "STR Specialist - Airbnb Host Resources",
  description:
    "Your central reliable resource for essential tools, templates, and training to maximize your hosting success",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white font-sans" style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}>
        <SessionProvider>
          <UserProvider>
            <CartProvider>
              <Header />
              <ScrollArrowEffect />
              <ScrollToTopButton />
              <div className="container mx-auto px-4 max-w-6xl">
                {children}
              </div>
              <Footer />
            </CartProvider>
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
