import { ReactNode } from "react";

interface StatusBadgeProps {
  status: "online" | "offline" | "warning" | "dormant";
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = {
    online: "bg-success/15 text-success border-success/20",
    offline: "bg-destructive/15 text-destructive border-destructive/20",
    warning: "bg-warning/15 text-warning border-warning/20",
    dormant: "glass-subtle text-muted-foreground border-transparent",
  };

  const dotColors = {
    online: "bg-success",
    offline: "bg-destructive",
    warning: "bg-warning animate-pulse-glow",
    dormant: "bg-muted-foreground",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide border backdrop-blur-sm ${colors[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`} />
      {label}
    </span>
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
    <div className="glass rounded-xl p-4 transition-all duration-300 hover:bg-[hsl(230_15%_14%/0.5)] group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground group-hover:text-foreground transition-colors">{icon}</span>}
      </div>
      <p className={`text-2xl font-semibold font-mono ${valueColors[accent]}`}>{value}</p>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-1.5">{subtitle}</p>}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

interface DataRowProps {
  label: string;
  value: ReactNode;
  mono?: boolean;
}

export function DataRow({ label, value, mono = true }: DataRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[hsl(0_0%_100%/0.05)] last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-sm ${mono ? "font-mono" : ""} text-foreground`}>{value}</span>
    </div>
  );
}
