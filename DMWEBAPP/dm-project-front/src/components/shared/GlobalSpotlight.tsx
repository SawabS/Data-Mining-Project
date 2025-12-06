import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export const GlobalSpotlight = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastParticlePos = useRef({ x: 0, y: 0 });
  const particleIdCounter = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate distance from last particle spawn
      const dist = Math.hypot(
        e.clientX - lastParticlePos.current.x,
        e.clientY - lastParticlePos.current.y
      );

      // Spawn a new particle every ~15px of movement for a denser trail
      if (dist > 15) {
        const id = particleIdCounter.current++;
        const size = Math.random() * 4 + 2; // Random size between 2px and 6px

        // Randomly choose between primary colors for "data point" look
        const colors = [
          "var(--cta)",
          "var(--primary_girl)",
          "var(--primary_boy)",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Add spread: Random offset between -15px and 15px
        const spread = 15;
        const offsetX = (Math.random() - 0.5) * spread * 2;
        const offsetY = (Math.random() - 0.5) * spread * 2;

        const newParticle: Particle = {
          id,
          x: e.clientX + offsetX,
          y: e.clientY + offsetY,
          size,
          color,
        };

        setParticles((prev) => [...prev, newParticle]);
        lastParticlePos.current = { x: e.clientX, y: e.clientY };

        // Remove particle after animation duration
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== id));
        }, 800);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 0.8,
              scale: 0,
              x: p.x - p.size / 2,
              y: p.y - p.size / 2,
            }}
            animate={{
              opacity: 0,
              scale: 1,
              // Slight drift
              x: p.x - p.size / 2 + (Math.random() - 0.5) * 10,
              y: p.y - p.size / 2 + (Math.random() - 0.5) * 10,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              // No box-shadow (glow) as requested
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
