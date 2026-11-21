"use client";

import { useEffect, useState } from "react";

/** Keeps the page theme and shared site chrome in sync across navigation. */
export function usePersistentTheme() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("whatif-theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialDark = savedTheme
        ? savedTheme === "dark"
        : prefersDark;

      // Synchronize the React state with the persisted browser preference on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDarkMode(initialDark);
      document.documentElement.dataset.theme = initialDark ? "dark" : "light";
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    try {
      window.localStorage.setItem("whatif-theme", darkMode ? "dark" : "light");
    } catch {
      // The visual theme still works when storage is unavailable.
    }
  }, [darkMode]);

  return [darkMode, setDarkMode] as const;
}
