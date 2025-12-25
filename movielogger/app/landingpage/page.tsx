"use client";

import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-12 overflow-hidden relative">
      {/* Left Section - Branding & Hero */}
      <div className="flex flex-col items-start justify-center lg:w-1/2 z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <Image
            src="/logo_light.png"
            alt="MovieLogger Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="text-xl font-medium text-zinc-800">MovieLogger</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight mb-6">
          Beautifully
          <br />
          Simple Movies
        </h1>

        {/* Attribution */}
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <span>Designed & Built in India by</span>
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
        </div>
      </div>

      {/* Right Section - Phone Mockup */}
      <div className="flex items-center justify-center lg:w-1/2 mt-12 lg:mt-0 relative">
        {/* Phone Frame */}
        <div className="relative">
          {/* Phone outer frame */}
          <div className="w-[280px] h-[560px] bg-zinc-900 rounded-[40px] p-2 shadow-2xl">
            {/* Phone inner screen */}
            <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-900 rounded-b-2xl"></div>
              
              {/* Screen Content */}
              <div className="pt-10 px-4 h-full overflow-hidden">
                {/* App Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-semibold text-zinc-900">MovieLogger</span>
                      <span className="text-xs">✨</span>
                    </div>
                    <p className="text-xs text-zinc-500">Tue 25 Dec</p>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-100 rounded-full px-3 py-1.5">
                    <span className="text-xs text-zinc-600">Search</span>
                    <span className="text-zinc-400 text-xs">🔍</span>
                  </div>
                </div>

                {/* Movie Cards */}
                <div className="space-y-3">
                  {/* Movie Card 1 */}
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg"></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-zinc-500">Watched • 4.7m</p>
                        <p className="text-xs font-medium text-zinc-800">The Dark Knight - An absolute masterpiece about chaos and order...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-zinc-500">▶ Play</span>
                      <span className="text-[10px] text-zinc-400">2h 32m</span>
                    </div>
                  </div>

                  {/* Movie Card 2 */}
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg"></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-zinc-500">Watch Later • 16 Sep</p>
                        <p className="text-xs font-medium text-zinc-800">Inception - What makes a dream feel great</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-zinc-500">▶ Play</span>
                      <span className="text-[10px] text-zinc-400">2h 28m</span>
                    </div>
                  </div>

                  {/* Movie Card 3 */}
                  <div className="bg-zinc-50 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg"></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-zinc-500">Suggested • 45 Apr</p>
                        <p className="text-xs font-medium text-zinc-800">Interstellar - Will it blow your mind? Or Save It?</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-zinc-500">▶ Play</span>
                      <span className="text-[10px] text-zinc-400">2h 49m</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-4 left-4 right-4 bg-zinc-100 rounded-full py-2 px-6 flex items-center justify-around">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full"></div>
                  <span className="text-zinc-700 text-sm">🎬</span>
                  <span className="text-zinc-700 text-sm">📝</span>
                  <span className="text-zinc-400 text-sm">⏸</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements - movie popcorn/film reel inspired */}
          <div className="absolute -right-16 top-20 w-24 h-24 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-2xl rotate-12 opacity-60 blur-sm"></div>
          <div className="absolute -left-12 bottom-32 w-16 h-16 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-full opacity-50 blur-sm"></div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-100 to-transparent opacity-50"></div>
    </div>
  );
}
