import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-50 to-white">
      {/* HERO */}
      <section className="py-20 text-center">
        <h1 className="text-5xl sm:text-7xl font-extrabold bg-gradient-to-br from-blue-600 to-violet-500 text-transparent bg-clip-text mb-6">
          Build Your Modern Affiliate Empire
        </h1>
        <p className="max-w-xl mx-auto text-xl text-gray-700 mb-8">
          Beautiful, blazing-fast affiliate sites with digital products, courses, and seamless API integrations. No code headaches, just results.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/blog" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg transition">
            See Blog
          </Link>
          <a
            href="https://onlinecoursehost.com/"
            className="bg-white border border-blue-600 text-blue-600 px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            My Course
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        <div className="bg-white rounded-2xl shadow-lg p-8 border hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2">Affiliate Links</h2>
          <p className="text-gray-600">Manage links, see clicks, and update offers—effortlessly.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2">Digital Downloads</h2>
          <p className="text-gray-600">Sell guides, checklists, and resources with Stripe/PayPal built in.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border hover:scale-105 transition">
          <h2 className="text-xl font-semibold mb-2">Courses</h2>
          <p className="text-gray-600">Connect your OnlineCourseHost content, beautifully displayed.</p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="text-center py-12">
        <h3 className="text-2xl font-bold mb-2">Want to see a demo checklist tool?</h3>
        <Link href="/blog" className="inline-block bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition">
          Explore Blog Tools
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-gray-400 py-8 text-center text-xs">
        © {new Date().getFullYear()} YourBrand. Modern Affiliate Builder with Next.js + Tailwind + Vercel.
      </footer>
    </main>
  );
}
