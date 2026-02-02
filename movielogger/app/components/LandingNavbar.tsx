"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

interface LandingNavbarProps {
  showViewDemo?: boolean;
}

export default function LandingNavbar({ showViewDemo = false }: LandingNavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      className="sticky top-0 z-50"
      style={{ backgroundColor: "rgba(250, 250, 250, 0.9)", backdropFilter: "blur(10px)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo - Left column */}
        <div className="flex items-center gap-2 sm:gap-2.5 md:min-w-[180px]">
          <Image
            src="/logo_dark.png"
            alt="Trackd"
            width={28}
            height={28}
          />
          <span style={{ fontSize: "18px", fontWeight: 600, color: "#757577" }} className="inline">
            Trackd
          </span>
        </div>

        {/* Navigation - Center column (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 justify-center">
          <button
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="px-3 lg:px-3.5 py-2 squircle-mask squircle-xl text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[14px] lg:text-[15px] font-medium"
          >
            Features
          </button>
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="px-3 lg:px-3.5 py-2 squircle-mask squircle-xl text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[14px] lg:text-[15px] font-medium"
          >
            How it works
          </button>
          <button
            onClick={() => document.getElementById("social")?.scrollIntoView({ behavior: "smooth" })}
            className="px-3 lg:px-3.5 py-2 squircle-mask squircle-xl text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[14px] lg:text-[15px] font-medium"
          >
            Social
          </button>
        </nav>

        {/* Actions - Right column */}
        <div className="flex items-center gap-2 sm:gap-3 md:min-w-[180px] justify-end">
          <button
            className={`hidden sm:block px-3 sm:px-4 py-2 squircle-mask squircle-xl bg-[#FFE8DD] text-[#FF5924] text-[14px] sm:text-[15px] font-semibold hover:bg-[#FFDDD2] transition-opacity duration-300 ease-in-out ${
              showViewDemo
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            View Demo
          </button>
          <button
            onClick={handleSignInClick}
            className="px-3 sm:px-3.5 py-2 squircle-mask squircle-xl text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[14px] sm:text-[15px] font-medium"
          >
            Sign in
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 squircle-mask squircle-xl text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900 transition-colors duration-300"
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200" style={{ backgroundColor: "rgba(250, 250, 250, 0.95)" }}>
          <nav className="flex flex-col px-4 py-3 gap-1">
            <button
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 squircle-mask squircle-xl text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[15px] font-medium text-left"
            >
              Features
            </button>
            <button
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 squircle-mask squircle-xl text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[15px] font-medium text-left"
            >
              How it works
            </button>
            <button
              onClick={() => {
                document.getElementById("social")?.scrollIntoView({ behavior: "smooth" });
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2.5 squircle-mask squircle-xl text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[15px] font-medium text-left"
            >
              Social
            </button>
            <button
              className={`px-3 py-2.5 squircle-mask squircle-xl bg-[#FFE8DD] text-[#FF5924] text-[15px] font-semibold hover:bg-[#FFDDD2] transition-colors duration-300 ease-in-out text-left sm:hidden ${
                showViewDemo ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              View Demo
            </button>
            <button
              onClick={handleSignInClick}
              className="px-3 py-2.5 squircle-mask squircle-xl text-zinc-500 hover:bg-[#efeff0] hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[15px] font-medium text-left"
            >
              Sign in
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
