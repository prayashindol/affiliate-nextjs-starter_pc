"use client"

import Link from "next/link";
import { FaAirbnb, FaFiverr, FaYoutube, FaInstagram, FaXTwitter } from "react-icons/fa6";

const footerLinks = [
  [
    { name: "Tools", href: "/tools" },
    { name: "Templates & Merch", href: "/templates" },
    { name: "Masterclass", href: "/masterclass" },
    { name: "Checklists", href: "/checklists" },
  ],
  [
    { name: "Guides", href: "/guides" },
    { name: "Industry News", href: "/news" },
    { name: "About", href: "/about" },
    { name: "Connect", href: "/connect" },
  ]
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 text-gray-700">
      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-0">
        {/* Navigation */}
        <nav className="flex-1 flex flex-col md:flex-row gap-4 md:gap-16">
          {footerLinks.map((group, i) => (
            <ul key={i} className="flex flex-col gap-2 min-w-[140px]">
              {group.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-indigo-600 transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </nav>

        {/* Newsletter */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center">
          <label htmlFor="newsletter" className="font-semibold mb-2 text-center md:text-left">
            Subscribe to the Newsletter
          </label>
          <form className="flex w-full max-w-xs">
            <input
              id="newsletter"
              type="email"
              required
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-l border border-gray-300 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r font-semibold hover:bg-indigo-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
        {/* Social Icons */}
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <Link href="https://airbnb.com/" target="_blank" rel="noopener noreferrer" aria-label="Airbnb">
            <FaAirbnb className="w-6 h-6" />
          </Link>
          <Link href="https://fiverr.com/" target="_blank" rel="noopener noreferrer" aria-label="Fiverr">
            <FaFiverr className="w-6 h-6" />
          </Link>
          <Link href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube className="w-6 h-6" />
          </Link>
          <Link href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="w-6 h-6" />
          </Link>
          <Link href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <FaXTwitter className="w-6 h-6" />
          </Link>
        </div>
        {/* Copyright & Legal */}
        <div className="text-gray-500 text-center md:text-right">
          © 2025 STR Specialist · <Link href="/privacy" className="underline hover:text-indigo-600">Privacy</Link> | by Prayas
        </div>
      </div>
    </footer>
  );
}
