import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatusBadgeProps {
  status: "online" | "offline" | "warning" | "dormant";
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = {
    online: "bg-success/10 text-success border-success/15",
    offline: "bg-destructive/10 text-destructive border-destructive/15",
    warning: "bg-warning/10 text-warning border-warning/15",
    dormant: "glass-subtle text-muted-foreground border-transparent",
  };

  const dotColors = {
    online: "bg-success",
    offline: "bg-destructive",
    warning: "bg-warning animate-pulse-glow",
    dormant: "bg-muted-foreground",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wider border backdrop-blur-md ${colors[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`} />
      {label}
    </motion.span>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accent?: "primary" | "success" | "warning" | "destructive" | "accent";
  subtitle?: string;
}

export function MetricCard({ label, value, icon, accent = "primary", subtitle }: MetricCardProps) {
  const valueColors = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    accent: "text-accent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ y: -2, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      className="glass-card rounded-2xl p-5 group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
        {icon && (
          <motion.span
            className="text-muted-foreground group-hover:text-foreground transition-colors duration-300"
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {icon}
          </motion.span>
        )}
      </div>
      <p className={`text-2xl font-semibold font-mono tracking-tight ${valueColors[accent]}`}>{value}</p>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-1.5 tracking-wide">{subtitle}</p>}
    </motion.div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1.5 tracking-wide">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}

interface DataRowProps {
  label: string;
  value: ReactNode;
  mono?: boolean;
}

export function DataRow({ label, value, mono = true }: DataRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[hsl(0_0%_100%/0.04)] last:border-0 group/row">
      <span className="text-xs text-muted-foreground tracking-wide">{label}</span>
      <span className={`text-sm ${mono ? "font-mono" : ""} text-foreground group-hover/row:text-primary transition-colors duration-200`}>{value}</span>
    </div>
  );
}
