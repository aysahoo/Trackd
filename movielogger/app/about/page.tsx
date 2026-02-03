"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { useLandingTheme } from "../hooks/useLandingTheme";

export default function AboutPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useLandingTheme();

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-300"
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: isDark ? "#0a0a0a" : "#fafafa",
      }}
    >
      <LandingNavbar showViewDemo={false} isDark={isDark} />

      <main className="flex-1">
        {/* About Hero */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          {/* Story Header */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 transition-colors duration-300"
              style={{ color: isDark ? "#fafafa" : "#18181b" }}
            >
              Our Story
            </h1>
            <p
              className="text-lg sm:text-xl font-medium transition-colors duration-300"
              style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
            >
              We're not movie buffs, we just got tired of forgetting
            </p>
          </div>

          {/* Story Content */}
          <article 
            className="prose prose-lg max-w-none"
            style={{ color: isDark ? "#d4d4d8" : "#3f3f46" }}
          >
            {/* The Origin */}
            <div 
              className="squircle-mask squircle-3xl p-8 sm:p-10 mb-8 transition-colors duration-300"
              style={{
                backgroundColor: isDark ? "#18181b" : "#ffffff",
                boxShadow: isDark
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <p 
                className="text-lg sm:text-xl leading-relaxed mb-6"
                style={{ color: isDark ? "#d4d4d8" : "#3f3f46" }}
              >
                Let&apos;s be honest: <span className="font-semibold" style={{ color: isDark ? "#fafafa" : "#18181b" }}>we&apos;re not cinephiles.</span> We don&apos;t have strong opinions about directors or debate film theory. We just watch stuff.
              </p>
              
              <p 
                className="text-lg leading-relaxed mb-6"
                style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
              >
                But we kept running into the same problem. Someone recommends a movie. You&apos;re pretty sure you&apos;ve seen it... or did you just see the trailer? You open Netflix, stare at it for 5 minutes, and eventually just rewatch The Office instead.
              </p>

              <p 
                className="text-lg leading-relaxed mb-6"
                style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
              >
                We tried the existing apps. They were built for people who rate movies on a 10-point scale and write 500-word reviews. That&apos;s not us. We just wanted to mark something as "watched" and move on. Maybe save a few things to watch later without losing them in a streaming app graveyard.
              </p>

              <p 
                className="text-lg leading-relaxed"
                style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
              >
                So we built <span className="font-semibold" style={{ color: "#FF5924" }}>Trackd</span> — for people like us. No pressure to rate everything, no social feed to keep up with. Just a simple way to remember what you&apos;ve watched and figure out what to watch next. That&apos;s it.
              </p>
            </div>

            {/* Open Source Section */}
            <div 
              className="squircle-mask squircle-3xl p-8 sm:p-10 mb-8 transition-colors duration-300"
              style={{
                backgroundColor: isDark ? "#18181b" : "#ffffff",
                boxShadow: isDark
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ color: isDark ? "#fafafa" : "#18181b" }}
              >
                Free & Open Source
              </h2>
              <p 
                className="text-lg leading-relaxed mb-6"
                style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
              >
                Trackd is completely free to use. No premium tiers, no paywalls, no &quot;upgrade to unlock&quot; nonsense. We built this for ourselves and decided to share it with the world.
              </p>
              <p 
                className="text-lg leading-relaxed mb-4"
                style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
              >
                The entire codebase is open source. You can see exactly how it works, suggest improvements, or even build your own version. Transparency is important to us.
              </p>
              

            </div>

            {/* Meet the Team */}
            <div 
              className="squircle-mask squircle-3xl p-8 sm:p-10 transition-colors duration-300"
              style={{
                backgroundColor: isDark ? "#18181b" : "#ffffff",
                boxShadow: isDark
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 
                className="text-2xl sm:text-3xl font-bold mb-6"
                style={{ color: isDark ? "#fafafa" : "#18181b" }}
              >
                Meet the Team
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Developer 1 */}
                <div 
                  className="squircle-mask squircle-2xl p-6 transition-colors duration-300"
                  style={{ backgroundColor: isDark ? "#27272a" : "#f4f4f5" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 squircle-mask squircle-xl overflow-hidden">
                      <Image
                        src="/pfp.jpeg"
                        alt="Ayush"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="font-bold text-lg"
                        style={{ color: isDark ? "#fafafa" : "#18181b" }}
                      >
                        Ayush
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: isDark ? "#71717a" : "#a1a1aa" }}
                      >
                        Developer
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href="https://x.com/ayushfyi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity duration-300 hover:opacity-70"
                        style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </Link>
                      <Link
                        href="https://github.com/aysahoo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity duration-300 hover:opacity-70"
                        style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Developer 2 */}
                <div 
                  className="squircle-mask squircle-2xl p-6 transition-colors duration-300"
                  style={{ backgroundColor: isDark ? "#27272a" : "#f4f4f5" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 squircle-mask squircle-xl overflow-hidden">
                      <Image
                        src="/adarsh.png"
                        alt="Adarsh"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="font-bold text-lg"
                        style={{ color: isDark ? "#fafafa" : "#18181b" }}
                      >
                        Adarsh
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: isDark ? "#71717a" : "#a1a1aa" }}
                      >
                        Developer
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href="https://x.com/adarshanatia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity duration-300 hover:opacity-70"
                        style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </Link>
                      <Link
                        href="https://github.com/Adarsha2004"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-opacity duration-300 hover:opacity-70"
                        style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* TMDB Attribution - Required */}
          <div className="mt-12 text-center">
            <p 
              className="text-sm transition-colors duration-300"
              style={{ color: isDark ? "#52525b" : "#a1a1aa" }}
            >
              This product uses the{" "}
              <Link
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
                style={{ color: isDark ? "#71717a" : "#71717a" }}
              >
                TMDB API
              </Link>{" "}
              but is not endorsed or certified by TMDB.
            </p>
          </div>
        </section>
      </main>

      <LandingFooter isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  );
}
