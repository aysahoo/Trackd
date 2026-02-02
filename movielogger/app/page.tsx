"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LandingNavbar from "./components/LandingNavbar";
import LandingFooter from "./components/LandingFooter";

export default function LandingPage() {
  const router = useRouter();
  const [showNavbarCta, setShowNavbarCta] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

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
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: "#fafafa",
      }}
    >
      <LandingNavbar showViewDemo={showNavbarCta} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="text-center">
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-zinc-900 mb-6 sm:mb-8">
              Never Lose Track of a Movie Again
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-zinc-500 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              The simple way to document your movie watching journey.
            </p>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 md:mb-20">
              <button
                onClick={handleStartLogging}
                className="w-full sm:w-auto px-6 py-3 squircle-mask squircle-2xl bg-[#FF5924] text-white text-base sm:text-lg font-bold hover:bg-[#e54d1f] transition-colors duration-300"
              >
                Start Logging
              </button>
              <button className="w-full sm:w-auto px-6 py-3 squircle-mask squircle-2xl bg-[#FFE8DD] text-[#FF5924] text-base sm:text-lg font-semibold hover:bg-[#FFDDD2] transition-colors duration-300">
                View Demo
              </button>
            </div>

            {/* App Showcase Area - Empty placeholder */}
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] squircle-mask squircle-2xl bg-zinc-100 flex items-center justify-center">
              <p className="text-zinc-400 text-sm">App showcase placeholder</p>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
