import { Wrench, Play, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { SectionHeader, DataRow, StatusBadge, MetricCard } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { mockRebuildStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { motion } from "framer-motion";

const RebuildPage = () => {
  return (
    <PageTransition variant="scale">
      <div className="space-y-8">
        <SectionHeader
          title="Rebuild Pipeline"
          description="cargo build with test-before-replace — safe binary swapping"
          action={
            <Button variant="outline" size="sm" className={`font-mono text-xs ${mockRebuildStatus.required ? "border-warning/30 text-warning hover:bg-warning/10" : "border-border text-muted-foreground"}`}>
              <Play className="h-3.5 w-3.5 mr-1.5" />Trigger Rebuild
            </Button>
          }
        />

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={mockRebuildStatus.required ? "warning" : "online"} label={mockRebuildStatus.required ? "REBUILD REQUIRED" : "UP TO DATE"} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard label="Status" value={mockRebuildStatus.required ? "Required" : "Current"} icon={mockRebuildStatus.required ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />} accent={mockRebuildStatus.required ? "warning" : "success"} subtitle="Build state" />
          <MetricCard label="Last Build" value="10:15" icon={<Clock className="h-4 w-4" />} accent="primary" subtitle={new Date(mockRebuildStatus.lastBuild).toLocaleDateString()} />
          <MetricCard label="Last Good" value={mockRebuildStatus.lastGoodCommit} icon={<Wrench className="h-4 w-4" />} accent="success" subtitle="Verified commit" />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-5">Pipeline Steps</h3>
          <div className="space-y-3">
            {[
              { step: 1, name: "Build in temp directory", desc: "cargo build --release in isolated temp dir" },
              { step: 2, name: "Run smoke test", desc: "Execute new binary with --smoke-test flag" },
              { step: 3, name: "Backup current exe", desc: "Copy running binary to .old backup" },
              { step: 4, name: "Replace executable", desc: "Atomic swap of new binary into position" },
              { step: 5, name: "Update last_good_commit", desc: "Record verified commit hash in settings" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, type: "spring" as const, stiffness: 300, damping: 25 }}
                className="flex items-center gap-4 py-3 px-4 glass-subtle rounded-xl"
              >
                <LiquidIcon color="neutral" size="sm" bounce={false}>
                  <span className="text-xs font-mono text-muted-foreground font-bold">{s.step}</span>
                </LiquidIcon>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground tracking-wide">{s.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">ready</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <LiquidIcon color="primary" size="sm" bounce={false}><Wrench className="h-4 w-4" /></LiquidIcon>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground text-sm">Safe-First Design</p>
              <p className="tracking-wide">The running executable remains functional until the new one is proven to work. If any step fails, the running binary is untouched. If replacement fails mid-swap, the .old backup exists and is offered on next startup.</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RebuildPage;
