"use client";

import Image from "next/image";

interface LandingFooterProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function LandingFooter({ isDark, toggleTheme }: LandingFooterProps) {
  return (
    <footer 
      className="py-6 sm:py-8 mt-auto transition-colors duration-300" 
      style={{ backgroundColor: isDark ? "#0a0a0a" : "#fafafa" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 sm:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image 
                src={isDark ? "/logo_light.png" : "/logo_dark.png"} 
                alt="Trackd" 
                width={28} 
                height={28} 
              />
            </div>
            <p style={{ fontSize: "18px", fontWeight: 600, color: isDark ? "#a1a1aa" : "#757577" }}>
              Track beautifully.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8 sm:gap-12 md:gap-16">
            <div className="flex flex-col gap-2 sm:gap-3">
              <a 
                href="#features" 
                className="transition-colors duration-300 ease-in-out text-[15px] font-medium"
                style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                onMouseEnter={(e) => e.currentTarget.style.color = isDark ? "#fafafa" : "#18181b"}
                onMouseLeave={(e) => e.currentTarget.style.color = isDark ? "#a1a1aa" : "#71717a"}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="transition-colors duration-300 ease-in-out text-[15px] font-medium"
                style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                onMouseEnter={(e) => e.currentTarget.style.color = isDark ? "#fafafa" : "#18181b"}
                onMouseLeave={(e) => e.currentTarget.style.color = isDark ? "#a1a1aa" : "#71717a"}
              >
                How it works
              </a>
              <a 
                href="#social" 
                className="transition-colors duration-300 ease-in-out text-[15px] font-medium"
                style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                onMouseEnter={(e) => e.currentTarget.style.color = isDark ? "#fafafa" : "#18181b"}
                onMouseLeave={(e) => e.currentTarget.style.color = isDark ? "#a1a1aa" : "#71717a"}
              >
                Social
              </a>
            </div>
            <div className="flex flex-col gap-2 sm:gap-3">
              <a 
                href="#" 
                className="transition-colors duration-300 ease-in-out text-[15px] font-medium"
                style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                onMouseEnter={(e) => e.currentTarget.style.color = isDark ? "#fafafa" : "#18181b"}
                onMouseLeave={(e) => e.currentTarget.style.color = isDark ? "#a1a1aa" : "#71717a"}
              >
                Privacy policy
              </a>
              <a 
                href="#" 
                className="transition-colors duration-300 ease-in-out text-[15px] font-medium"
                style={{ color: isDark ? "#a1a1aa" : "#71717a" }}
                onMouseEnter={(e) => e.currentTarget.style.color = isDark ? "#fafafa" : "#18181b"}
                onMouseLeave={(e) => e.currentTarget.style.color = isDark ? "#a1a1aa" : "#71717a"}
              >
                Terms of service
              </a>
            </div>
          </div>
        </div>

        {/* Copyright & Theme Toggle */}
        <div className="flex flex-col items-center mt-8 sm:mt-12">
          <div 
            className="w-full border-t transition-colors duration-300"
            style={{ borderColor: isDark ? "#27272a" : "#e4e4e7" }}
          />
          <div className="flex items-center justify-between w-full mt-4 sm:mt-5">
            <p style={{ fontSize: "14px", fontWeight: 600, color: isDark ? "#71717a" : "#9ca3af" }}>
              © Trackd 2026
            </p>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 squircle-mask squircle-xl transition-all duration-300"
              style={{ 
                backgroundColor: isDark ? "#18181b" : "#f4f4f5",
                color: isDark ? "#a1a1aa" : "#71717a"
              }}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"/>
                </svg>
              )}
              <span className="text-xs font-medium">
                {isDark ? "Light" : "Dark"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
