
'use client'

import Link from "next/link"

// --- FOOTER LINKS ---
const footerLinks = [
  { name: "Tools", href: "/tools" },
  { name: "Templates & Merch", href: "/templates" },
  { name: "Masterclass", href: "/masterclass" },
  { name: "Checklists", href: "/checklists" },
  { name: "Guides", href: "/guides" },
  { name: "Industry News", href: "/news" },
  { name: "About", href: "/about" },
  { name: "Connect", href: "/connect" },
]

// --- SOCIAL PLATFORMS ---
const platforms = [
  { name: "Airbnb", slug: "airbnb", url: "https://airbnb.com" },
  { name: "Fiverr", slug: "fiverr", url: "https://fiverr.com" },
  { name: "YouTube", slug: "youtube", url: "https://youtube.com" },
  { name: "Instagram", slug: "instagram", url: "https://instagram.com" },
  { name: "Twitter", slug: "x", url: "https://x.com" }, // (Twitter is now "X")
  // Add or remove as needed
]

// --- COMPONENT ---
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:justify-between gap-8">
        {/* Left: Footer nav */}
        <nav className="flex-1">
          <ul className="flex flex-wrap gap-5 md:gap-8 font-medium">
            {footerLinks.map(link => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Center: Newsletter */}
        <div className="flex-1 flex flex-col items-start md:items-center">
          <span className="mb-2 text-sm font-semibold text-gray-700">Subscribe to the Newsletter</span>
          <form
            className="flex w-full max-w-xs"
            onSubmit={e => { e.preventDefault(); alert("Subscribed! (hook up backend later)"); }}
          >
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-l border border-gray-300 focus:outline-none focus:border-indigo-500 text-sm"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r font-semibold hover:bg-indigo-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Right: Social icons */}
        <div className="flex-1 flex flex-col items-start md:items-end gap-4">
          <div className="flex gap-4">
            {platforms.map(p => (
              <a
                key={p.slug}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.name}
                className="hover:scale-110 transition"
              >
                <img
                  src={`https://cdn.simpleicons.org/${p.slug}/333333`}
                  alt={p.name}
                  className="w-6 h-6"
                />
              </a>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} STR Specialist &middot;{' '}
            <Link href="/privacy" className="underline hover:text-indigo-600">Privacy</Link>
            {' '}| by <span className="font-medium">Prayas</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
