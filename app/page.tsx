// app/page.tsx

import Image from "next/image";

type AchievementCardProps = {
  imgSrc: string;
  alt: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  ctaBg: string;
  ctaHoverBg: string;
  ctaText: string;
};

function AchievementCard({
  imgSrc,
  alt,
  title,
  description,
  href,
  cta,
  ctaBg,
  ctaHoverBg,
  ctaText,
}: AchievementCardProps) {
  // Compose Tailwind classes for hover bg and text color dynamically
  // Since bg colors are inline styles, only transition, shadow, and rounded-full via classes
  return (
    <div className="rounded-xl bg-white/60 backdrop-blur-md border border-teal-300/30 p-6 flex flex-col items-center shadow-md text-center">
      <Image src={imgSrc} alt={alt} width={56} height={56} className="mb-4" />
      <h3 className="font-semibold text-[#2D334A]">{title}</h3>
      <p className="text-sm text-slate-700 opacity-80 mt-2 mb-3">{description}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        // Tailwind hover for bg and text is tricky with inline styles,
        // so keep bg-color inline, add hover:bg-opacity and smooth transition
        className={`rounded-full px-5 py-2 font-semibold shadow transition-colors`}
        style={{
          backgroundColor: ctaBg,
          color: ctaText,
          userSelect: "none",
        }}
      >
        {cta}
      </a>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#CBD5E1] text-[#2D334A] font-sans">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-teal-600 text-5xl font-extrabold drop-shadow-md max-w-4xl">
          #1 Resource Hub for Airbnb Hosts
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-700 opacity-80">
          Tools, templates, guidance & real results — helping you grow, automate, and thrive as an Airbnb host.
        </p>
        <a
          href="#tools"
          className="mt-8 inline-block rounded-full px-10 py-3 text-white font-semibold shadow-lg bg-[#14B8A6] hover:bg-[#FF7E5F] transition-colors"
        >
          Browse Top Hosting Tools
        </a>
      </section>

      {/* ABOUT PRAYAS */}
      <section className="mx-auto mb-14 max-w-4xl px-6 sm:px-0">
        <div className="flex flex-col md:flex-row items-center gap-6 bg-white/70 backdrop-blur-md rounded-xl p-8 shadow-lg border border-teal-300/40">
          <Image
            src="/prayas.jpg"
            alt="Prayas Choudhary"
            width={96}
            height={96}
            className="rounded-full border-4 border-teal-600"
            priority
          />
          <div>
            <h2 className="text-2xl font-bold text-[#2D334A] mb-1">Meet Prayas Choudhary</h2>
            <p className="mb-2 text-slate-700 opacity-80 max-w-xl">
              Started hosting in 2016 — now managing 200+ properties across multiple countries.
              My journey from host to Airbnb Ambassador lets me help you shortcut your path to success.
            </p>
            <a
              href="https://your-airbnb-story-link"
              className="font-medium text-teal-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discover My Full Story
            </a>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS / CONNECT WITH ME */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-6 sm:px-0 mb-16">
        <AchievementCard
          imgSrc="/airbnb-ambassador.svg"
          alt="Airbnb Ambassador"
          title="Airbnb Ambassador"
          description="1:1 strategic coaching, exclusive resources, & real results."
          href="https://airbnb.com/affiliate-link"
          cta="Connect on Airbnb"
          ctaBg="#14B8A6"
          ctaHoverBg="#FF7E5F"
          ctaText="white"
        />
        <AchievementCard
          imgSrc="/fiverr.svg"
          alt="Fiverr Pro Seller"
          title="Fiverr Pro Consultant"
          description="Top-rated, 100+ reviews. Expert Airbnb consultations for growth."
          href="https://fiverr.com/yourprofile"
          cta="Book on Fiverr Pro"
          ctaBg="#14B8A6"
          ctaHoverBg="#6EE7B7"
          ctaText="white"
        />
        <AchievementCard
          imgSrc="/webinar-icon.svg"
          alt="Weekly Webinar"
          title="Weekly Airbnb Webinar"
          description="Live Q&A and fresh strategies—join over 5,000 hosts!"
          href="https://webinar-link"
          cta="Reserve Your Spot"
          ctaBg="#FF7E5F"
          ctaHoverBg="#14B8A6"
          ctaText="white"
        />
        <AchievementCard
          imgSrc="/youtube.svg"
          alt="YouTube Channel"
          title="No-Nonsense Airbnb"
          description="Free tips, reviews & hosting stories. Subscribe for weekly uploads!"
          href="https://youtube.com/yourchannel"
          cta="Watch & Subscribe"
          ctaBg="#6EE7B7"
          ctaHoverBg="#FF7E5F"
          ctaText="#2D334A"
        />
      </section>

      {/* AFFILIATE TOOLS DIRECTORY */}
      <section id="tools" className="max-w-7xl mx-auto px-6 sm:px-0 py-10">
        <h2 className="text-3xl font-extrabold text-teal-600 mb-6">Top Tools & Software for Hosts</h2>
        <div className="text-gray-500">[Software directory cards go here]</div>
      </section>

      {/* TEMPLATES & MERCH */}
      <section className="max-w-7xl mx-auto pt-16 pb-10 px-6 sm:px-0">
        <h2 className="text-2xl font-extrabold text-[#2D334A] mb-4">Digital Templates & Airbnb Merch</h2>
        <div className="text-gray-500">[Templates and merch cards go here]</div>
      </section>

      {/* TRAINING PROGRAM */}
      <section className="max-w-5xl mx-auto px-6 sm:px-0 py-12 mb-12">
        <div className="rounded-xl bg-[#2D334A] text-white p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg">
          <div>
            <h3 className="text-2xl font-extrabold mb-2">No-Nonsense Airbnb Hosting Masterclass</h3>
            <p className="mb-4 opacity-90">
              Kickstart your hosting journey or unlock pro-level strategies. Enroll today and access actionable step-by-step training direct from an Airbnb veteran.
            </p>
            <a
              href="https://your-masterclass-link"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#FF7E5F] font-bold shadow hover:bg-[#14B8A6] transition-colors"
            >
              Join the Masterclass
            </a>
          </div>
        </div>
      </section>

      {/* LATEST POSTS */}
      <section className="max-w-7xl mx-auto px-6 sm:px-0 py-8">
        <h2 className="text-2xl font-extrabold text-[#2D334A] mb-4">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-xl bg-white/80 p-6 shadow backdrop-blur-sm">
            <div className="h-36 rounded bg-[#CBD5E1] mb-4" />
            <h3 className="text-teal-600 font-semibold mb-2">How to Automate Your Airbnb in 2025</h3>
            <p className="text-sm text-slate-700 opacity-80">
              Discover the latest tools and tips for hands-free hosting, boosting bookings and revenue.
            </p>
          </article>
          {/* More posts can be dynamically loaded here */}
        </div>
      </section>

      {/* NEWSLETTER & INDUSTRY NEWS */}
      <section className="flex flex-col items-center bg-gradient-to-tr from-[#F8FAFC] to-[#CBD5E1] py-12 px-6 sm:px-0">
        <h2 className="text-xl font-bold text-[#2D334A] mb-4">Stay Ahead — Get News & Hot Tips</h2>
        <form className="flex w-full max-w-md gap-4" onSubmit={(e) => e.preventDefault()}>
          <input
            aria-label="Email address"
            type="email"
            required
            placeholder="Your email"
            className="rounded-full px-5 py-2 outline-none border border-[#CBD5E1] bg-white/70 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-teal-600"
          />
          <button
            type="submit"
            className="rounded-full px-6 py-2 font-semibold text-white shadow transition-colors bg-[#14B8A6] hover:bg-[#FF7E5F]"
          >
            Subscribe
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="py-6 bg-[#F1F5F9] text-center text-[#334155] mt-10">
        © {new Date().getFullYear()} Prayas Choudhary · All Rights Reserved ·{" "}
        <a
          href="https://strspecialist.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-teal-600 underline"
        >
          strspecialist.com
        </a>
      </footer>
    </main>
  );
}
