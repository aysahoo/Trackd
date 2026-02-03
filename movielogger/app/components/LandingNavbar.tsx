"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

interface LandingNavbarProps {
  showViewDemo?: boolean;
  isDark?: boolean;
}

export default function LandingNavbar({ showViewDemo = false, isDark = false }: LandingNavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  const handleSignInClick = async () => {
    const session = await authClient.getSession();
    if (session.data) {
      router.push("/app");
    } else {
      router.push("/signin");
    }
  };

  return (
    <header
      className="sticky top-0 z-50 transition-colors duration-300"
      style={{ 
        backgroundColor: isDark ? "rgba(10, 10, 10, 0.9)" : "rgba(250, 250, 250, 0.9)", 
        backdropFilter: "blur(10px)" 
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo - Left column */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 md:min-w-[180px] cursor-pointer">
          <Image
            src={isDark ? "/logo_light.png" : "/logo_dark.png"}
            alt="Trackd"
            width={28}
            height={28}
          />
          <span 
            className="inline transition-colors duration-300"
            style={{ fontSize: "18px", fontWeight: 600, color: isDark ? "#a1a1aa" : "#757577" }}
          >
            Trackd
          </span>
        </Link>

        {/* Navigation - Center column (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 justify-center">
          <button
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className={`cursor-pointer px-3 lg:px-3.5 py-2 squircle-mask squircle-xl transition-colors duration-300 ease-in-out text-[14px] lg:text-[15px] font-medium ${
              isDark 
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                : "text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900"
            }`}
          >
            Features
          </button>
          <button
            onClick={() => router.push("/pricing")}
            className={`cursor-pointer px-3 lg:px-3.5 py-2 squircle-mask squircle-xl transition-colors duration-300 ease-in-out text-[14px] lg:text-[15px] font-medium ${
              isDark 
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                : "text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900"
            }`}
          >
            Pricing
          </button>
          
          {/* Resources Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              className={`cursor-pointer px-3 lg:px-3.5 py-2 squircle-mask squircle-xl transition-colors duration-300 ease-in-out text-[14px] lg:text-[15px] font-medium ${
                isDark 
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                  : "text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900"
              }`}
            >
              Resources
            </button>
            
            {/* Dropdown Menu */}
            <div 
              className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ease-out ${
                resourcesOpen 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 -translate-y-1 pointer-events-none"
              }`}
            >
              <div 
                className="squircle-mask squircle-xl min-w-[160px]"
                style={{ 
                  backgroundColor: isDark ? "#18181b" : "#ffffff",
                  boxShadow: isDark 
                    ? "0 10px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)"
                    : "0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)"
                }}
              >
              <div className="flex flex-col p-1.5 gap-0.5">
                <button
                  className={`cursor-pointer px-3 py-2 squircle-mask squircle-lg transition-colors duration-200 text-[14px] font-medium text-left ${
                    isDark 
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                      : "text-zinc-600 hover:bg-[#f5f5f5] hover:text-zinc-900"
                  }`}
                >
                  What&apos;s new
                </button>
                <button
                  className={`cursor-pointer px-3 py-2 squircle-mask squircle-lg transition-colors duration-200 text-[14px] font-medium text-left ${
                    isDark 
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                      : "text-zinc-600 hover:bg-[#f5f5f5] hover:text-zinc-900"
                  }`}
                >
                  Help Center
                </button>
                <button
                  className={`cursor-pointer px-3 py-2 squircle-mask squircle-lg transition-colors duration-200 text-[14px] font-medium text-left ${
                    isDark 
                      ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                      : "text-zinc-600 hover:bg-[#f5f5f5] hover:text-zinc-900"
                  }`}
                >
                  FAQ
                </button>
              </div>
            </div>
            </div>
          </div>
        </nav>

        {/* Actions - Right column */}
        <div className="flex items-center gap-2 sm:gap-3 md:min-w-[180px] justify-end">
          <button
            className={`cursor-pointer hidden sm:block px-3 sm:px-4 py-2 squircle-mask squircle-xl text-[14px] sm:text-[15px] font-semibold transition-opacity duration-300 ease-in-out ${
              isDark 
                ? "bg-[#3d1f14] text-[#FF5924] hover:bg-[#4d2a1c]" 
                : "bg-[#FFE8DD] text-[#FF5924] hover:bg-[#FFDDD2]"
            } ${
              showViewDemo
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            View Demo
          </button>
          <button
            onClick={handleSignInClick}
            className={`cursor-pointer hidden md:block px-3 sm:px-3.5 py-2 squircle-mask squircle-xl transition-colors duration-300 ease-in-out text-[14px] sm:text-[15px] font-medium ${
              isDark 
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                : "text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900"
            }`}
          >
            Sign in
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`cursor-pointer md:hidden p-2 squircle-mask squircle-xl transition-colors duration-300 ${
              isDark 
                ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                : "text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900"
            }`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu modal - always rendered for fade animation */}
      <>

        
        {/* Squircle dropdown modal */}
        <div 
          className={`md:hidden absolute right-4 top-full mt-2 z-50 squircle-mask squircle-2xl min-w-[200px] transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ 
            backgroundColor: isDark ? "#18181b" : "#ffffff",
            boxShadow: isDark 
              ? "0 10px 40px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)"
              : "0 10px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)"
          }}
        >
          <nav className="flex flex-col p-2 gap-0.5">
            <button
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                setMobileMenuOpen(false);
              }}
              className={`cursor-pointer px-3 py-2.5 squircle-mask squircle-xl transition-colors duration-200 ease-in-out text-[15px] font-medium text-left ${
                isDark 
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                  : "text-zinc-600 hover:bg-[#f5f5f5] hover:text-zinc-900"
              }`}
            >
              Features
            </button>
            <button
              onClick={() => {
                router.push("/pricing");
                setMobileMenuOpen(false);
              }}
              className={`cursor-pointer px-3 py-2.5 squircle-mask squircle-xl transition-colors duration-200 ease-in-out text-[15px] font-medium text-left ${
                isDark 
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                  : "text-zinc-600 hover:bg-[#f5f5f5] hover:text-zinc-900"
              }`}
            >
              Pricing
            </button>
            
            {/* Resources Section Label */}
            <div className={`px-3 pt-3 pb-1 text-[12px] font-semibold uppercase tracking-wide ${
              isDark ? "text-zinc-500" : "text-zinc-400"
            }`}>
              Resources
            </div>
            <button
              className={`cursor-pointer px-3 py-2.5 squircle-mask squircle-xl transition-colors duration-200 ease-in-out text-[15px] font-medium text-left ${
                isDark 
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                  : "text-zinc-600 hover:bg-[#f5f5f5] hover:text-zinc-900"
              }`}
            >
              What&apos;s new
            </button>
            <button
              className={`cursor-pointer px-3 py-2.5 squircle-mask squircle-xl transition-colors duration-200 ease-in-out text-[15px] font-medium text-left ${
                isDark 
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                  : "text-zinc-600 hover:bg-[#f5f5f5] hover:text-zinc-900"
              }`}
            >
              Help Center
            </button>
            <button
              className={`cursor-pointer px-3 py-2.5 squircle-mask squircle-xl transition-colors duration-200 ease-in-out text-[15px] font-medium text-left ${
                isDark 
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                  : "text-zinc-600 hover:bg-[#f5f5f5] hover:text-zinc-900"
              }`}
            >
              FAQ
            </button>
            
            {/* Divider */}
            <div className={`h-px my-1 mx-2 ${isDark ? "bg-zinc-700" : "bg-zinc-200"}`} />
            
            {showViewDemo && (
              <button
                className={`cursor-pointer px-3 py-2.5 squircle-mask squircle-xl text-[15px] font-semibold transition-colors duration-200 ease-in-out text-left sm:hidden ${
                  isDark 
                    ? "bg-[#3d1f14] text-[#FF5924] hover:bg-[#4d2a1c]" 
                    : "bg-[#FFE8DD] text-[#FF5924] hover:bg-[#FFDDD2]"
                }`}
              >
                View Demo
              </button>
            )}
            <button
              onClick={() => {
                handleSignInClick();
                setMobileMenuOpen(false);
              }}
              className={`cursor-pointer px-3 py-2.5 squircle-mask squircle-xl transition-colors duration-200 ease-in-out text-[15px] font-medium text-left ${
                isDark 
                  ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" 
                  : "text-zinc-600 hover:bg-[#f5f5f5] hover:text-zinc-900"
              }`}
            >
              Sign in
            </button>
          </nav>
        </div>
      </>
    </header>
  );
}
