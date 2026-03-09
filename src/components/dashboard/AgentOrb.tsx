import { motion } from "framer-motion";

interface AgentOrbProps {
  active?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { orb: 12, ring: 12 },
  md: { orb: 24, ring: 24 },
  lg: { orb: 40, ring: 40 },
};

export function AgentOrb({ active = true, size = "md" }: AgentOrbProps) {
  const s = sizeMap[size];

  return (
    <div className="relative flex items-center justify-center">
      {active && (
        <motion.div
          className="absolute rounded-full border border-primary/30"
          style={{ width: s.ring, height: s.ring }}
          animate={{
            scale: [0.8, 2.5],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
      <motion.div
        className={`rounded-full ${active ? "bg-primary" : "bg-muted-foreground/50"}`}
        style={{ width: s.orb, height: s.orb }}
        animate={
          active
            ? {
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 16px hsl(215 100% 60% / 0.2)",
                  "0 0 28px hsl(215 100% 60% / 0.4)",
                  "0 0 16px hsl(215 100% 60% / 0.2)",
                ],
              }
            : undefined
        }
        transition={
          active
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />
    </div>
  );
}
