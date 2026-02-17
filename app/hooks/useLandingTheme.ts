"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function useLandingTheme() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Migrate legacy landing theme preference to next-themes once.
    const legacyTheme = localStorage.getItem("landingTheme");
    if (!theme && (legacyTheme === "dark" || legacyTheme === "light")) {
      setTheme(legacyTheme);
    }

    if (legacyTheme) {
      localStorage.removeItem("landingTheme");
    }
  }, [mounted, theme, setTheme]);

  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return { isDark, toggleTheme, mounted };
}
