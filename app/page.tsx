import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-tl from-sky-50 via-white to-fuchsia-50 flex flex-col">
      {/* HERO */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 bg-gradient-to-br from-blue-700 via-fuchsia-700 to-emerald-500 text-transparent bg-clip-text drop-shadow-lg">
          Your No-Nonsense Airbnb Toolkit
        </h1>
        <p className="text-xl sm:text-2xl max-w-2xl mx-auto text-gray-700 mb-7">
          The ultimate, unbiased directory of software, tools, templates, and resources for short-term rental hosts.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link href="#tools" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transition">Browse Top Tools</Link>
          <Link href="#templates" className="bg-white border border-blue-700 text-blue-700 px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-blue-50 transition">Get Free Templates</Link>
          <Link href="#course" className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transition">Start the Masterclass</Link>
        </div>
        <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
          <span>⭐ Trusted by 4,000+ hosts</span>
          <span>•</span>
          <a href="https://youtube.com/@NoNonsenseAirbnb" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">Watch on YouTube</a>
        </div>
      </section>

      {/* TOOLS DIRECTORY */}
      <section id="tools" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Top Tools for Airbnb Hosts</h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">Browse, compare, and discover the best software to manage every part of your rental business. No hype, just honest reviews and ratings.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Example cards - Replace with dynamic content later */}
          <div className="bg-white rounded-2xl shadow-md p-8 border flex flex-col hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">HostAway</h3>
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <span>⭐ 4.8</span>
              <span className="text-gray-500 text-xs">(Editor’s Pick)</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Best for: Growing portfolios. Reliable channel manager.</p>
            <div className="flex gap-2 mt-auto">
              <Link href="#" className="text-blue-700 underline font-medium">Review</Link>
              <span className="text-gray-300">|</span>
              <Link href="#" className="text-fuchsia-600 underline font-medium">Try Now</Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 border flex flex-col hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">PriceLabs</h3>
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <span>⭐ 4.7</span>
              <span className="text-gray-500 text-xs">(Dynamic Pricing)</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Best for: Maximizing revenue with smart pricing tools.</p>
            <div className="flex gap-2 mt-auto">
              <Link href="#" className="text-blue-700 underline font-medium">Review</Link>
              <span className="text-gray-300">|</span>
              <Link href="#" className="text-fuchsia-600 underline font-medium">Try Now</Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 border flex flex-col hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">OwnerRez</h3>
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <span>⭐ 4.6</span>
              <span className="text-gray-500 text-xs">(Automation)</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">Best for: Automating guest messaging and reservations.</p>
            <div className="flex gap-2 mt-auto">
              <Link href="#" className="text-blue-700 underline font-medium">Review</Link>
              <span className="text-gray-300">|</span>
              <Link href="#" className="text-fuchsia-600 underline font-medium">Try Now</Link>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="#" className="text-blue-700 underline font-semibold">See full directory &rarr;</Link>
        </div>
      </section>

      {/* DIGITAL TEMPLATES & MERCH */}
      <section id="templates" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Digital Templates & Host Merch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-8 border flex flex-col hover:scale-105 transition">
            <h3 className="text-lg font-semibold mb-2">Airbnb Welcome Book Template</h3>
            <p className="text-gray-600 mb-4">Customizable PDF to wow your guests & save time.</p>
            <Link href="#" className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-center">View Template</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 border flex flex-col hover:scale-105 transition">
            <h3 className="text-lg font-semibold mb-2">Cleaning Checklist (Printable)</h3>
            <p className="text-gray-600 mb-4">Keep turnovers spotless. Staff or DIY—never miss a step.</p>
            <Link href="#" className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-center">View Checklist</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 border flex flex-col hover:scale-105 transition">
            <h3 className="text-lg font-semibold mb-2">Host Life T-shirt</h3>
            <p className="text-gray-600 mb-4">Wear your hosting pride! Exclusive merch for pros.</p>
            <Link href="#" className="bg-fuchsia-700 text-white px-4 py-2 rounded-lg font-semibold text-center">Shop Merch</Link>
          </div>
        </div>
        <div className="text-center">
          <Link href="#" className="text-blue-700 underline font-semibold">See all templates &rarr;</Link>
        </div>
      </section>

      {/* MASTERCLASS / COURSE */}
      <section id="course" className="bg-gradient-to-br from-fuchsia-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">No-Nonsense Airbnb Hosting Masterclass</h2>
          <p className="text-lg text-gray-700 mb-6">Practical, proven strategies for new and experienced hosts. Stop guessing—start growing your income and reviews!</p>
          <Link href="#" className="bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition">See Course Details</Link>
        </div>
      </section>

      {/* LATEST INDUSTRY NEWS */}
      <section id="news" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Latest Airbnb News & Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border">
            <h4 className="text-lg font-semibold mb-2">Airbnb Updates Cancellation Policy (2025)</h4>
            <p className="text-gray-600 text-sm mb-2">Get the latest on flexible bookings and host protection...</p>
            <Link href="#" className="text-blue-700 underline font-medium">Read More</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border">
            <h4 className="text-lg font-semibold mb-2">10 Best Airbnb Tools for 2025</h4>
            <p className="text-gray-600 text-sm mb-2">The must-haves for automating, pricing, and scaling your rental.</p>
            <Link href="#" className="text-blue-700 underline font-medium">Read More</Link>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border">
            <h4 className="text-lg font-semibold mb-2">How to Automate Your Messaging</h4>
            <p className="text-gray-600 text-sm mb-2">Save 5+ hours/week and boost guest reviews with these tools.</p>
            <Link href="#" className="text-blue-700 underline font-medium">Read More</Link>
          </div>
        </div>
        <div className="text-center mt-8">
          <Link href="#" className="text-blue-700 underline font-semibold">See all news &rarr;</Link>
        </div>
      </section>

      {/* ABOUT / TRUST */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white/60 rounded-2xl shadow p-8 flex flex-col items-center text-center">
          <img
            src="https://i.imgur.com/5cX1B7k.png" // Placeholder avatar, swap for your pic!
            alt="Your Photo"
            className="rounded-full w-24 h-24 border-4 border-blue-200 mb-4"
          />
          <h3 className="text-xl font-bold mb-2">Prayas, Real Airbnb Superhost</h3>
          <p className="text-gray-700 mb-3">
            I’ve helped 4,000+ hosts grow with honest advice—no BS. Host since 2017, sharing tools that actually work.
          </p>
          <div className="flex gap-4">
            <a href="https://youtube.com/@NoNonsenseAirbnb" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-medium">Watch YouTube</a>
            <a href="#" className="text-fuchsia-700 underline font-medium">Join Host Community</a>
          </div>
        </div>
      </section>

      {/* EMAIL OPT-IN */}
      <section className="text-center py-12 bg-gradient-to-b from-blue-50 to-white">
        <h4 className="text-2xl font-bold mb-2">Get Free Hosting Resources & Tips Weekly!</h4>
        <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email"
            className="rounded-xl border border-gray-300 px-5 py-3 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-7 py-3 rounded-xl transition shadow"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="text-gray-400 py-8 text-center text-xs">
        © {new Date().getFullYear()} strspecialist.com. Modern Airbnb Resource. Built with Next.js + Tailwind + Vercel.
      </footer>
    </main>
  );
}
