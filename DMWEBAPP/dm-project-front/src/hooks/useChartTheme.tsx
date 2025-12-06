import { useEffect, useState } from "react";

interface ChartTheme {
  textColor: string;
  gridColor: string;
  backgroundColor: string;
  mutedColor: string;
}

/**
 * Hook to get theme-aware colors for chart components
 * Watches for theme changes and updates colors accordingly
 */
export const useChartTheme = (): ChartTheme => {
  const [theme, setTheme] = useState<ChartTheme>({
    textColor: "#000000",
    gridColor: "#e0e0e0",
    backgroundColor: "#ffffff",
    mutedColor: "#9e9e9e",
  });

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      setTheme({
        textColor:
          computedStyle.getPropertyValue("--on-white-text").trim() || "#000000",
        gridColor:
          computedStyle.getPropertyValue("--border-color").trim() || "#e0e0e0",
        backgroundColor:
          computedStyle.getPropertyValue("--background").trim() || "#ffffff",
        mutedColor:
          computedStyle.getPropertyValue("--muted").trim() || "#9e9e9e",
      });
    };

    // Initial update
    updateTheme();

    // Watch for theme changes via class mutations on documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
};
