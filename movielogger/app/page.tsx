"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LandingNavbar from "./components/LandingNavbar";
import LandingFooter from "./components/LandingFooter";
import { useLandingTheme } from "./hooks/useLandingTheme";

export default function LandingPage() {
  const router = useRouter();
  const [showNavbarCta, setShowNavbarCta] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme, mounted } = useLandingTheme();

  const handleStartLogging = async () => {
    const session = await authClient.getSession();
    if (session.data) {
      router.push("/app");
    } else {
      router.push("/signin");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNavbarCta(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: isDark ? "#0a0a0a" : "#fafafa",
      }}
    >
      <LandingNavbar showViewDemo={showNavbarCta} isDark={isDark} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="text-center">
            {/* Headline */}
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 sm:mb-8 break-words transition-colors duration-300"
              style={{ color: isDark ? "#fafafa" : "#18181b" }}
            >
              Document Your Movie Journey.
            </h1>

            {/* Subheadline */}
            <p 
              className="text-lg sm:text-xl md:text-2xl font-medium mb-6 sm:mb-8 max-w-2xl mx-auto px-2 transition-colors duration-300"
              style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
            >
              Your personal movie diary<br className="sm:hidden" /> <span className="sm:hidden lowercase">log</span><span className="hidden sm:inline"> Log</span> every film and revisit your favorites anytime.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 md:mb-20">
              <button
                onClick={handleStartLogging}
                className="flex-1 sm:flex-initial px-6 py-3 squircle-mask squircle-2xl bg-[#FF5924] text-white text-base sm:text-lg font-bold hover:bg-[#e54d1f] transition-colors duration-300"
              >
                Start Logging
              </button>
              <button 
                className={`flex-1 sm:flex-initial px-6 py-3 squircle-mask squircle-2xl text-[#FF5924] text-base sm:text-lg font-semibold transition-colors duration-300 ${
                  isDark 
                    ? "bg-[#3d1f14] hover:bg-[#4d2a1c]" 
                    : "bg-[#FFE8DD] hover:bg-[#FFDDD2]"
                }`}
              >
                View Demo
              </button>
            </div>

            {/* App Showcase Area */}
            <div 
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] squircle-mask squircle-2xl flex items-center justify-center overflow-hidden relative transition-colors duration-300"
              style={{ 
                backgroundColor: isDark ? "#18181b" : "#f4f4f5"
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="w-16 h-16 sm:w-20 sm:h-20 squircle-mask squircle-2xl shadow-lg flex items-center justify-center transition-colors duration-300"
                  style={{ backgroundColor: isDark ? "#27272a" : "#ffffff" }}
                >
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF5924]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
                  </svg>
                </div>
                <p 
                  className="text-sm font-medium transition-colors duration-300"
                  style={{ color: "#71717a" }}
                >
                  App showcase coming soon
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Built for Movie Lovers Section */}
        <section id="features" className="py-10 sm:py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300"
                style={{ color: isDark ? "#fafafa" : "#18181b" }}
              >
                Built for movie lovers, not<br className="hidden sm:block" /> just the process around them.
              </h2>
            </div>

            {/* Feature Icons Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto">
              {/* Track Watchlist */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 squircle-mask squircle-2xl bg-[#afe4ff] flex items-center justify-center mb-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 squircle-mask squircle-2xl bg-[#afe4ff] flex items-center justify-center mb-3">
                </div>
                </div>
                <span 
                  className="text-sm sm:text-base font-semibold transition-colors duration-300"
                  style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                >
                  Track Watchlist
                </span>
              </div>

              {/* Rate & Review */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 squircle-mask squircle-2xl bg-[#965aff]/20 flex items-center justify-center mb-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 squircle-mask squircle-2xl bg-[#965aff]/20 flex items-center justify-center mb-3">
                </div>
                </div>
                <span 
                  className="text-sm sm:text-base font-semibold transition-colors duration-300"
                  style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                >
                  Rate & Review
                </span>
              </div>

              {/* Share with Friends */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 squircle-mask squircle-2xl bg-[#ffe77a] flex items-center justify-center mb-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 squircle-mask squircle-2xl bg-[#ffe77a] flex items-center justify-center mb-3">
                </div>
                </div>
                <span 
                  className="text-sm sm:text-base font-semibold transition-colors duration-300"
                  style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                >
                  Share with Friends
                </span>
              </div>

              {/* Get Suggestions */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 squircle-mask squircle-2xl bg-[#00babf]/20 flex items-center justify-center mb-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 squircle-mask squircle-2xl bg-[#00babf]/20 flex items-center justify-center mb-3">
                </div>
                </div>
                <span 
                  className="text-sm sm:text-base font-semibold transition-colors duration-300"
                  style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                >
                  Get Suggestions
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* All the Basics Section */}
        <section id="how-it-works" className="py-10 sm:py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-stretch">
              {/* Left: Text Content */}
              <div>
                <p className="text-[#FF5924] font-semibold text-sm uppercase tracking-wide mb-3">THE ESSENTIALS</p>
                <h2 
                  className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300"
                  style={{ color: isDark ? "#fafafa" : "#18181b" }}
                >
                  All the basics,<br />done beautifully.
                </h2>
                <p 
                  className="text-lg font-medium mb-8 transition-colors duration-300"
                  style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                >
                  Everything you need to track your movie journey, designed with care and attention to detail.
                </p>

                {/* Feature Checklist */}
                <div className="space-y-4">
                  {[
                    { text: "Track movies, TV shows & anime" },
                    { text: "Rate with 1-5 stars" },
                    { text: "Mark as watched or watch later" },
                    { text: "Search by title or actor" },
                    { text: "Add and connect with friends" },
                    { text: "Beautiful dark mode" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 squircle-mask squircle-xl bg-[#00babf]/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-8 h-8 squircle-mask squircle-xl bg-[#00babf]/20 flex items-center justify-center flex-shrink-0">
                      </div>
                      </div>
                      <span 
                        className="font-medium transition-colors duration-300"
                        style={{ color: isDark ? "#d4d4d8" : "#3f3f46" }}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Feature Card */}
              <div className="h-full">
                <div className="squircle-mask squircle-3xl bg-[#afe4ff] p-6 sm:p-8 h-full min-h-[400px] flex flex-col justify-center relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold text-zinc-900 text-3xl mb-4">Complete Control.</h3>
                    <p className="text-zinc-700 text-lg font-medium">
                      Find any movie, TV show, or anime instantly. Rate, review, and organize your entire viewing history in one beautiful place.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* App Screenshot Section */}
        <section className="py-10 sm:py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="squircle-mask squircle-3xl bg-[#afe4ff] p-4 sm:p-6 md:p-8">
              <div 
                className="squircle-mask squircle-2xl h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center shadow-xl transition-colors duration-300"
                style={{ backgroundColor: isDark ? "#18181b" : "#ffffff" }}
              >
                <div className="flex flex-col items-center gap-4 text-center px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
                  </div>
                  <p 
                    className="text-sm font-medium transition-colors duration-300"
                    style={{ color: isDark ? "#71717a" : "#a1a1aa" }}
                  >
                    Your movie collection view
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Belong Together / Your Movie World Section */}
        <section id="social" className="py-10 sm:py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16">
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300"
                style={{ color: isDark ? "#fafafa" : "#18181b" }}
              >
                Your movie world.
              </h2>
              <p 
                className="text-lg font-medium max-w-2xl mx-auto transition-colors duration-300"
                style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
              >
                Everything you need to organize, discover, and enjoy your movie journey in one beautiful place.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Watchlist Card - Large */}
              <div className="lg:col-span-2 squircle-mask squircle-3xl bg-[#ffe77a] p-5 sm:p-8 min-h-[280px] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 squircle-mask squircle-xl bg-white/80 mb-4">
                    <span className="font-semibold text-zinc-700">Your Watchlist</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-semibold text-zinc-900 mb-2">All in one place</h3>
                  <p className="text-zinc-600 font-medium max-w-md">Movies, TV shows, and anime. Mark as watched or save for later. Filter by type anytime.</p>
                </div>
                <div className="absolute bottom-4 right-4 w-24 h-24 sm:w-32 sm:h-32 squircle-mask squircle-2xl bg-white/50" />
              </div>

              {/* Friends Card */}
              <div className="squircle-mask squircle-3xl bg-[#afe4ff] p-5 sm:p-8 min-h-[280px] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 squircle-mask squircle-xl bg-white/80 mb-4">
                    <span className="font-semibold text-zinc-700">Friends</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 mb-2">Connect with others</h3>
                  <p className="text-zinc-600 text-sm font-medium">Add friends and share your movie taste. Send and receive friend requests.</p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-20">
                <div className="absolute bottom-4 right-4 opacity-20">
                </div>
                </div>
              </div>

              {/* Ratings Card */}
              <div className="squircle-mask squircle-3xl bg-[#965aff]/20 p-5 sm:p-8 min-h-[280px] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 squircle-mask squircle-xl bg-white/80 mb-4">
                    <span className="font-semibold text-zinc-700">Ratings</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 mb-2">Rate every film</h3>
                  <p className="text-zinc-600 text-sm font-medium">Give 1-5 stars to every movie. Your ratings are always visible in your collection.</p>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-1">
                  {[40, 60, 35, 75, 50].map((h, i) => (
                    <div key={i} className="w-4 squircle-mask squircle-sm bg-[#965aff]/40" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>

              {/* Suggestions Card - Large */}
              <div className="lg:col-span-2 squircle-mask squircle-3xl bg-[#00babf]/20 p-5 sm:p-8 min-h-[280px] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 squircle-mask squircle-xl bg-white/80 mb-4">
                    <span className="font-semibold text-zinc-700">Suggestions</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-900 mb-2">Get recommendations</h3>
                  <p className="text-zinc-600 font-medium max-w-md">Receive movie suggestions from friends. Add them to your watchlist or dismiss with a tap.</p>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-12 h-12 squircle-mask squircle-xl bg-white/60" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grow Your Collection Section */}
        <section className="py-10 sm:py-20 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-stretch">
              {/* Left: Content */}
              <div>
                <p className="text-[#FF5924] font-semibold text-sm uppercase tracking-wide mb-3">SOCIAL FEATURES</p>
                <h2 
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300"
                  style={{ color: isDark ? "#fafafa" : "#18181b" }}
                >
                  Better with friends.
                </h2>
                <p 
                  className="text-lg font-medium mb-8 transition-colors duration-300"
                  style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                >
                  Movies are better shared. Connect with friends and trade recommendations.</p>

                {/* Feature Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { title: "Add Friends", desc: "By email address" },
                    { title: "Send Movies", desc: "Share suggestions" },
                    { title: "Get Notified", desc: "New recommendations" },
                    { title: "Accept or Pass", desc: "Your choice" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div>
                        <h4 
                          className="font-semibold transition-colors duration-300"
                          style={{ color: isDark ? "#fafafa" : "#18181b" }}
                        >
                          {feature.title}
                        </h4>
                        <p 
                          className="text-sm font-medium transition-colors duration-300"
                          style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                        >
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-full">
                <div className="w-full h-full min-h-[400px] squircle-mask squircle-3xl bg-[#a8d5ba] flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 squircle-mask squircle-2xl bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-10 sm:py-20 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 transition-colors duration-300"
              style={{ color: isDark ? "#fafafa" : "#18181b" }}
            >
              Ready to get started?
            </h2>
            <p 
              className="text-lg font-medium mb-10 max-w-xl mx-auto transition-colors duration-300"
              style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
            >
              Join movie lovers who are documenting their cinema journey. It&apos;s free to start.
            </p>

            {/* Feature Icons Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-2xl mx-auto mb-10">
              {[
                { title: "Movies", desc: "Blockbusters to indie" },
                { title: "TV Shows", desc: "Series & seasons" },
                { title: "Anime", desc: "Your favorites" },
                { title: "Friends", desc: "Share & discover" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div 
                    className="w-14 h-14 squircle-mask squircle-2xl flex items-center justify-center mb-2 transition-colors duration-300"
                    style={{ backgroundColor: isDark ? "#27272a" : "#f4f4f5" }}
                  />
                  <h4 
                    className="font-semibold text-sm transition-colors duration-300"
                    style={{ color: isDark ? "#fafafa" : "#18181b" }}
                  >
                    {item.title}
                  </h4>
                  <p 
                    className="text-xs font-medium transition-colors duration-300"
                    style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={handleStartLogging}
              className="px-6 py-3 sm:px-8 sm:py-4 squircle-mask squircle-2xl bg-[#FF5924] text-white text-base sm:text-lg font-bold hover:bg-[#e54d1f] transition-colors duration-300 shadow-lg shadow-[#FF5924]/25"
            >
              Start Logging — It&apos;s Free
            </button>
          </div>
        </section>
      </main>

      <LandingFooter isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  );
}
