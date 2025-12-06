import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ChartLoaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  height?: number;
}

export const ChartLoader = ({
  title,
  description,
  icon,
  height = 400,
}: ChartLoaderProps) => {
  return (
    <Card className="w-full bg-[var(--card_full_white)] border-[var(--border-color)] animate-in fade-in duration-300 overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-[var(--on-white-text)]">{title}</CardTitle>
        </div>
        {description && (
          <p className="text-sm text-[var(--muted)] mt-2">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="group flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-[var(--border-color)] bg-[var(--background)] transition-colors overflow-hidden relative cursor-crosshair"
          style={{ height: `${height}px` }}
        >
          <DataProcessingAnimation />

          {/* Loading text */}
          <div className="text-center space-y-2 z-10 pointer-events-none">
            <p className="text-lg font-semibold text-[var(--on-white-text)] animate-pulse">
              Processing data...
            </p>
            <p className="text-sm text-[var(--muted)]">
              Filtering and aggregating accident records
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DataProcessingAnimation = () => {
  // Generate stable random points for the scatter plot
  const [points] = useState(() =>
    Array.from({ length: 15 }).map((_, i) => ({
      x: 20 + i * (260 / 14),
      y: 100 + Math.sin(i * 0.5) * 50 + (Math.random() - 0.5) * 30,
      id: i,
    }))
  );

  // Helper to generate a smooth curve string (Quadratic Bezier through midpoints)
  const generatePath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i].x + pts[i + 1].x) / 2;
      const yc = (pts[i].y + pts[i + 1].y) / 2;
      d += ` Q ${pts[i].x} ${pts[i].y}, ${xc} ${yc}`;
    }
    d += ` T ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
    return d;
  };

  // 1. Flat Line (Mean Y)
  const flatPoints = points.map((p) => ({ x: p.x, y: 100 }));

  // 2. Linear Trend (Approximate)
  const trendPoints = points.map((p, i) => ({
    x: p.x,
    y: 120 - i * 3,
  }));

  // 3. The "Perfect" Fit (The points themselves)
  const fitPoints = points;

  const curves = [
    generatePath(flatPoints),
    generatePath(trendPoints),
    generatePath(fitPoints),
  ];

  return (
    <div className="relative w-[300px] h-[200px]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 200"
        className="overflow-visible"
      >
        {/* Grid Lines with Data Flow Effect */}
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Horizontal Data Streams */}
        {[40, 80, 120, 160].map((y, i) => (
          <motion.circle
            key={`stream-${i}`}
            r="1"
            fill="var(--cta)"
            initial={{ cx: 0, cy: y, opacity: 0 }}
            animate={{
              cx: [0, 300],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Data Points with Interaction */}
        {points.map((p, i) => (
          <InteractivePoint key={i} p={p} index={i} />
        ))}

        {/* Fitting Line Animation */}
        <motion.path
          d={curves[0]}
          stroke="var(--cta)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 0 4px var(--cta))"
          animate={{
            d: curves,
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Enhanced Scanning Bar */}
        <motion.g
          animate={{
            x: [0, 300],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <rect
            x="0"
            y="0"
            width="2"
            height="200"
            fill="var(--cta)"
            opacity="0.5"
          />
          <rect
            x="-20"
            y="0"
            width="40"
            height="200"
            fill="url(#scan-gradient)"
            opacity="0.2"
          />
        </motion.g>

        <defs>
          <linearGradient id="scan-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--cta)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--cta)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--cta)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const InteractivePoint = ({
  p,
  index,
}: {
  p: { x: number; y: number };
  index: number;
}) => {
  return (
    <motion.circle
      cx={p.x}
      cy={p.y}
      r="4"
      fill="var(--primary_girl)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.4, 1, 0.4],
        fill: ["var(--primary_girl)", "var(--cta)", "var(--primary_girl)"],
      }}
      transition={{
        delay: index * (2 / 15), // Sync with scanner duration (2s) / num points
        duration: 2, // Loop every 2s to match scanner
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 2, opacity: 1, fill: "var(--cta)" }}
    />
  );
};
