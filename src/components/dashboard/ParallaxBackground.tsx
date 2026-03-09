import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export function ParallaxBackground() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 30, damping: 30, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Layer parallax offsets (deeper layers move more)
  const layer1X = useTransform(smoothX, [0, 1], [-15, 15]);
  const layer1Y = useTransform(smoothY, [0, 1], [-10, 10]);
  const layer2X = useTransform(smoothX, [0, 1], [12, -12]);
  const layer2Y = useTransform(smoothY, [0, 1], [8, -8]);
  const layer3X = useTransform(smoothX, [0, 1], [-8, 8]);
  const layer3Y = useTransform(smoothY, [0, 1], [-15, 15]);
  const layer4X = useTransform(smoothX, [0, 1], [6, -6]);
  const layer4Y = useTransform(smoothY, [0, 1], [4, -4]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-background" />

      {/* Parallax gradient layers — neutral greys in dark, tinted in light */}
      <motion.div
        className="absolute -inset-[10%]"
        style={{
          x: layer1X,
          y: layer1Y,
          background: "radial-gradient(ellipse 80% 50% at 15% -5%, hsl(0 0% 100% / 0.04) 0%, transparent 60%)",
        }}
      />
      <motion.div
        className="absolute -inset-[10%]"
        style={{
          x: layer2X,
          y: layer2Y,
          background: "radial-gradient(ellipse 60% 40% at 85% 5%, hsl(0 0% 100% / 0.03) 0%, transparent 55%)",
        }}
      />
      <motion.div
        className="absolute -inset-[10%]"
        style={{
          x: layer3X,
          y: layer3Y,
          background: "radial-gradient(ellipse 70% 60% at 50% 110%, hsl(0 0% 100% / 0.035) 0%, transparent 55%)",
        }}
      />
      <motion.div
        className="absolute -inset-[10%]"
        style={{
          x: layer4X,
          y: layer4Y,
          background: "radial-gradient(ellipse 50% 30% at -5% 50%, hsl(0 0% 100% / 0.02) 0%, transparent 45%)",
        }}
      />
      <motion.div
        className="absolute -inset-[10%]"
        style={{
          x: layer2X,
          y: layer3Y,
          background: "radial-gradient(ellipse 40% 40% at 100% 60%, hsl(0 0% 100% / 0.025) 0%, transparent 50%)",
        }}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}
