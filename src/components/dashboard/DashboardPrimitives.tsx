import { ReactNode } from "react";

interface StatusBadgeProps {
  status: "online" | "offline" | "warning" | "dormant";
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const colors = {
    online: "bg-success/20 text-success border-success/30 glow-success",
    offline: "bg-destructive/20 text-destructive border-destructive/30 glow-destructive",
    warning: "bg-warning/20 text-warning border-warning/30 glow-warning",
    dormant: "bg-muted text-muted-foreground border-border",
  };

  const dotColors = {
    online: "bg-success",
    offline: "bg-destructive",
    warning: "bg-warning animate-pulse-glow",
    dormant: "bg-muted-foreground",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${colors[status]}`}>
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
  const accentColors = {
    primary: "border-primary/20 hover:border-primary/40",
    success: "border-success/20 hover:border-success/40",
    warning: "border-warning/20 hover:border-warning/40",
    destructive: "border-destructive/20 hover:border-destructive/40",
    accent: "border-accent/20 hover:border-accent/40",
  };

  const valueColors = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
    accent: "text-accent",
  };

  return (
    <div className={`bg-card rounded-lg border ${accentColors[accent]} p-4 transition-colors`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className={`text-2xl font-mono font-bold ${valueColors[accent]}`}>{value}</p>
      {subtitle && <p className="text-[11px] font-mono text-muted-foreground mt-1">{subtitle}</p>}
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
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
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
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className={`text-sm ${mono ? "font-mono" : ""} text-foreground`}>{value}</span>
    </div>
  );
}
