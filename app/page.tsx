import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-br from-[#F8FAFC] to-[#CBD5E1] min-h-screen text-[#2D334A]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-16 pb-12">
        <h1 className="text-5xl font-extrabold mb-4 text-[#14B8A6] drop-shadow-lg">
          #1 Resource Hub for Airbnb Hosts
        </h1>
        <p className="max-w-xl text-lg text-[#334155] opacity-70">
          Tools, templates, guidance & real results—helping you grow, automate, and thrive as an Airbnb host.
        </p>
        <a
          href="#tools"
          className="mt-8 px-8 py-3 rounded-full bg-[#14B8A6] text-white font-semibold shadow-lg hover:bg-[#FF7E5F] transition"
        >
          Browse Top Hosting Tools
        </a>
      </section>

      {/* About Prayas */}
      <section className="flex flex-col md:flex-row items-center justify-center mb-10 gap-8 mx-4">
        <div className="backdrop-blur-md bg-white/70 rounded-xl shadow-lg px-8 py-6 flex items-center w-full md:w-2/3">
          <Image
            src="/prayas.jpg"
            alt="Prayas Choudhary"
            width={90}
            height={90}
            className="rounded-full border-4 border-[#14B8A6] mr-6"
          />
          <div>
            <h2 className="text-2xl font-bold mb-1 text-[#2D334A]">Meet Prayas Choudhary</h2>
            <p className="text-[#334155] opacity-80 mb-2">
              Started hosting in 2016—now managing 200+ properties across multiple countries. My journey from host to Airbnb Ambassador lets me help you shortcut your path to success.
            </p>
            <a href="https://your-airbnb-story-link" className="text-[#14B8A6] underline font-medium">
              Discover My Full Story
            </a>
          </div>
        </div>
      </section>

      {/* Achievements / Connect With Me */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 mb-14">
        <div className="rounded-xl bg-white/60 backdrop-blur-md p-6 flex flex-col items-center shadow-md border border-[#14B8A6]/20">
          <Image src="/airbnb-ambassador.svg" alt="Airbnb Ambassador" width={56} height={56} />
          <h3 className="font-semibold mt-4 text-[#2D334A]">Airbnb Ambassador</h3>
          <p className="text-sm text-[#334155] opacity-80 mt-2 text-center">
            1:1 strategic coaching, exclusive resources, & real results.
          </p>
          <a
            href="https://airbnb.com/affiliate-link"
            target="_blank"
            className="mt-3 px-5 py-2 bg-[#14B8A6] text-white rounded-full shadow hover:bg-[#FF7E5F] transition"
          >
            Connect on Airbnb
          </a>
        </div>
        <div className="rounded-xl bg-white/60 backdrop-blur-md p-6 flex flex-col items-center shadow-md border border-[#14B8A6]/20">
          <Image src="/fiverr.svg" alt="Fiverr Pro Seller" width={56} height={56} />
          <h3 className="font-semibold mt-4 text-[#2D334A]">Fiverr Pro Consultant</h3>
          <p className="text-sm text-[#334155] opacity-80 mt-2 text-center">
            Top-rated, 100+ reviews. Expert Airbnb consultations for growth.
          </p>
          <a
            href="https://fiverr.com/yourprofile"
            target="_blank"
            className="mt-3 px-5 py-2 bg-[#14B8A6] text-white rounded-full shadow hover:bg-[#6EE7B7] transition"
          >
            Book on Fiverr Pro
          </a>
        </div>
        <div className="rounded-xl bg-white/60 backdrop-blur-md p-6 flex flex-col items-center shadow-md border border-[#14B8A6]/20">
          <Image src="/webinar-icon.svg" alt="Weekly Webinar" width={56} height={56} />
          <h3 className="font-semibold mt-4 text-[#2D334A]">Weekly Airbnb Webinar</h3>
          <p className="text-sm text-[#334155] opacity-80 mt-2 text-center">
            Live Q&A and fresh strategies—join over 5,000 hosts!
          </p>
          <a
            href="https://webinar-link"
            target="_blank"
            className="mt-3 px-5 py-2 bg-[#FF7E5F] text-white rounded-full shadow hover:bg-[#14B8A6] transition"
          >
            Reserve Your Spot
          </a>
        </div>
        <div className="rounded-xl bg-white/60 backdrop-blur-md p-6 flex flex-col items-center shadow-md border border-[#14B8A6]/20">
          <Image src="/youtube.svg" alt="YouTube No-Nonsense Airbnb" width={56} height={56} />
          <h3 className="font-semibold mt-4 text-[#2D334A]">No-Nonsense Airbnb</h3>
          <p className="text-sm text-[#334155] opacity-80 mt-2 text-center">
            Free tips, reviews & hosting stories. Subscribe for weekly uploads!
          </p>
          <a
            href="https://youtube.com/yourchannel"
            target="_blank"
            className="mt-3 px-5 py-2 bg-[#6EE7B7] text-[#2D334A] rounded-full shadow hover:bg-[#FF7E5F] transition"
          >
            Watch & Subscribe
          </a>
        </div>
      </section>

      {/* Affiliate Tools Directory */}
      <section id="tools" className="max-w-7xl mx-auto py-10 px-4">
        <h2 className="text-3xl font-extrabold text-[#14B8A6] mb-6">
          Top Tools & Software for Hosts
        </h2>
        <div className="text-gray-500">[Software directory cards go here]</div>
      </section>

      {/* Templates & Merch */}
      <section className="max-w-7xl mx-auto pt-16 pb-10 px-4">
        <h2 className="text-2xl font-extrabold text-[#2D334A] mb-4">
          Digital Templates & Airbnb Merch
        </h2>
        <div className="text-gray-500">[Templates and merch cards go here]</div>
      </section>

      {/* Training Program */}
      <section className="max-w-5xl mx-auto px-4 py-12 mb-12">
        <div className="rounded-xl bg-[#2D334A] text-white p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg">
          <div>
            <h3 className="text-2xl font-extrabold mb-2">
              No-Nonsense Airbnb Hosting Masterclass
            </h3>
            <p className="mb-4 opacity-90">
              Kickstart your hosting journey or unlock pro-level strategies. Enroll today and access actionable step-by-step training direct from an Airbnb veteran.
            </p>
            <a
              href="https://your-masterclass-link"
              target="_blank"
              className="px-6 py-3 rounded-full bg-[#FF7E5F] font-bold shadow hover:bg-[#14B8A6] transition"
            >
              Join the Masterclass
            </a>
          </div>
        </div>
      </section>

      {/* Latest Posts (WordPress feed) */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-extrabold text-[#2D334A] mb-4">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl bg-white/80 p-5 shadow">
            <div className="h-36 bg-[#CBD5E1] rounded mb-3" />
            <h4 className="font-semibold text-[#14B8A6] mb-1">
              How to Automate Your Airbnb in 2025
            </h4>
            <p className="text-sm text-[#334155] opacity-80">
              Discover the latest tools and tips for hands-free hosting, boosting bookings and revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter/Industry News */}
      <section className="px-4 py-12 flex flex-col items-center bg-gradient-to-tl from-[#F8FAFC] to-[#CBD5E1]">
        <h2 className="text-xl font-bold text-[#2D334A] mb-3">
          Stay Ahead—Get News & Hot Tips
        </h2>
        <form className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email"
            className="rounded-full px-5 py-2 outline-none bg-white/70 border border-[#CBD5E1] shadow"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-full bg-[#14B8A6] text-white font-semibold shadow hover:bg-[#FF7E5F] transition"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-[#334155] bg-[#F1F5F9] mt-8">
        © {new Date().getFullYear()} Prayas Choudhary · All rights reserved ·{" "}
        <span className="text-[#14B8A6] font-semibold">strspecialist.com</span>
      </footer>
    </main>
  );
}
