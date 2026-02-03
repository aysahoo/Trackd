"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { useLandingTheme } from "../hooks/useLandingTheme";

export default function PricingPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useLandingTheme();
  const [isYearly, setIsYearly] = useState(false);
  const [displayPrice, setDisplayPrice] = useState(2.99);
  const animationRef = useRef<number | null>(null);

  const monthlyPrice = 2.99;
  const yearlyPrice = 29.99;

  useEffect(() => {
    const targetPrice = isYearly ? yearlyPrice : monthlyPrice;
    const startPrice = displayPrice;
    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const currentPrice = startPrice + (targetPrice - startPrice) * easeOutCubic;
      setDisplayPrice(currentPrice);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isYearly]);

  const handleGetStarted = async () => {
    const session = await authClient.getSession();
    if (session.data) {
      router.push("/app");
    } else {
      router.push("/signin");
    }
  };

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
        {/* Pricing Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="text-center mb-12">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 transition-colors duration-300"
              style={{ color: isDark ? "#fafafa" : "#18181b" }}
            >
              Simple Pricing
            </h1>
            <p
              className="text-lg sm:text-xl font-medium max-w-xl mx-auto transition-colors duration-300"
              style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
            >
              One plan. Everything included.<br />No hidden fees.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <div
              className="squircle-mask squircle-3xl p-8 sm:p-10 transition-colors duration-300"
              style={{
                backgroundColor: isDark ? "#18181b" : "#ffffff",
                boxShadow: isDark
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  : "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Plan Badge & Billing Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center px-3 py-1 squircle-mask squircle-xl bg-[#FF5924]/10">
                  <span className="text-sm font-semibold text-[#FF5924]">Pro Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className={`text-xs font-semibold px-2 py-0.5 squircle-mask squircle-lg bg-green-500/20 text-green-500 transition-all duration-300 ${
                      isYearly ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Save 17%
                  </span>
                  <button
                    onClick={() => setIsYearly(!isYearly)}
                    className={`cursor-pointer relative w-11 h-6 rounded-full transition-colors duration-300 ${
                      isYearly ? "bg-[#FF5924]" : isDark ? "bg-zinc-700" : "bg-zinc-300"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        isYearly ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-5xl sm:text-6xl font-bold transition-colors duration-300"
                    style={{ color: isDark ? "#fafafa" : "#18181b" }}
                  >
                    ${displayPrice.toFixed(2)}
                  </span>
                  <span
                    className="text-lg font-medium transition-colors duration-300"
                    style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                  >
                    {isYearly ? "/year" : "/month"}
                  </span>
                </div>
                <p
                  className="text-sm font-medium mt-2 transition-colors duration-300"
                  style={{ color: isDark ? "#71717a" : "#a1a1aa" }}
                >
                  {isYearly ? "Billed annually. Cancel anytime." : "Billed monthly. Cancel anytime."}
                </p>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full mb-6 transition-colors duration-300"
                style={{ backgroundColor: isDark ? "#27272a" : "#e4e4e7" }}
              />

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {[
                  "Log unlimited movies, TV shows & anime",
                  "Never forget what you've watched",
                  "Get movie recommendations from friends",
                  "Share your favorites instantly",
                  "Access your collection anywhere",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 squircle-mask squircle-lg bg-[#FF5924] flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span
                      className="font-medium transition-colors duration-300"
                      style={{ color: isDark ? "#d4d4d8" : "#3f3f46" }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={handleGetStarted}
                className="cursor-pointer w-full py-4 squircle-mask squircle-2xl bg-[#FF5924] text-white text-lg font-bold hover:bg-[#e54d1f] transition-colors duration-300"
              >
                Get Started
              </button>
            </div>


          </div>
        </section>
      </main>

      <LandingFooter isDark={isDark} toggleTheme={toggleTheme} />
    </div>
  );
}
