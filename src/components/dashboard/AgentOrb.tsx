interface AgentOrbProps {
  active?: boolean;
  size?: "sm" | "md" | "lg";
}

export function AgentOrb({ active = true, size = "md" }: AgentOrbProps) {
  const sizes = {
    sm: { orb: "h-3 w-3", ring: "h-3 w-3" },
    md: { orb: "h-6 w-6", ring: "h-6 w-6" },
    lg: { orb: "h-10 w-10", ring: "h-10 w-10" },
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulsing ring */}
      {active && (
        <div
          className={`absolute ${sizes[size].ring} rounded-full border border-primary/40 animate-orb-ring`}
        />
      )}
      {/* Core orb */}
      <div
        className={`${sizes[size].orb} rounded-full ${
          active
            ? "bg-primary animate-orb-pulse"
            : "bg-muted-foreground/50"
        }`}
      />
    </div>
  );
}
