import Image from "next/image";

export default function LandingFooter() {
  return (
    <footer className="py-6 sm:py-8 mt-auto" style={{ backgroundColor: "#fafafa" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 sm:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/logo_dark.png" alt="Trackd" width={28} height={28} />
            </div>
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#757577" }}>Track beautifully.</p>
          </div>

          {/* Links */}
          <div className="flex gap-8 sm:gap-12 md:gap-16">
            <div className="flex flex-col gap-2 sm:gap-3">
              <a href="#features" className="text-zinc-500 hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[15px] font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-zinc-500 hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[15px] font-medium">
                How it works
              </a>
              <a href="#social" className="text-zinc-500 hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[15px] font-medium">
                Social
              </a>
            </div>
            <div className="flex flex-col gap-2 sm:gap-3">
              <a href="#" className="text-zinc-500 hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[15px] font-medium">
                Privacy policy
              </a>
              <a href="#" className="text-zinc-500 hover:text-zinc-900 transition-colors duration-300 ease-in-out text-[15px] font-medium">
                Terms of service
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center mt-8 sm:mt-12">
          <div className="w-full border-t border-zinc-200"></div>
          <p className="mt-4 sm:mt-5" style={{ fontSize: "14px", fontWeight: 600, color: "#9ca3af" }}>© Trackd 2026</p>
        </div>
      </div>
    </footer>
  );
}
