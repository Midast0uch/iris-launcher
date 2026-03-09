import { Wrench, Play, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { SectionHeader, DataRow, StatusBadge, MetricCard } from "@/components/dashboard/DashboardPrimitives";
import { mockRebuildStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/dashboard/PageTransition";

const RebuildPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Rebuild Pipeline"
        description="cargo build with test-before-replace — safe binary swapping"
        action={
          <Button
            variant="outline"
            size="sm"
            className={`font-mono text-xs ${
              mockRebuildStatus.required
                ? "border-warning/30 text-warning hover:bg-warning/10 hover:text-warning"
                : "border-border text-muted-foreground"
            }`}
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            Trigger Rebuild
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <StatusBadge
          status={mockRebuildStatus.required ? "warning" : "online"}
          label={mockRebuildStatus.required ? "REBUILD REQUIRED" : "UP TO DATE"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Status"
          value={mockRebuildStatus.required ? "Required" : "Current"}
          icon={mockRebuildStatus.required ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          accent={mockRebuildStatus.required ? "warning" : "success"}
          subtitle="Build state"
        />
        <MetricCard
          label="Last Build"
          value="10:15"
          icon={<Clock className="h-4 w-4" />}
          accent="primary"
          subtitle={new Date(mockRebuildStatus.lastBuild).toLocaleDateString()}
        />
        <MetricCard
          label="Last Good"
          value={mockRebuildStatus.lastGoodCommit}
          icon={<Wrench className="h-4 w-4" />}
          accent="success"
          subtitle="Verified commit"
        />
      </div>

      {/* Pipeline steps */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Pipeline Steps</h3>
        <div className="space-y-3">
          {[
            { step: 1, name: "Build in temp directory", desc: "cargo build --release in isolated temp dir", status: "ready" },
            { step: 2, name: "Run smoke test", desc: "Execute new binary with --smoke-test flag", status: "ready" },
            { step: 3, name: "Backup current exe", desc: "Copy running binary to .old backup", status: "ready" },
            { step: 4, name: "Replace executable", desc: "Atomic swap of new binary into position", status: "ready" },
            { step: 5, name: "Update last_good_commit", desc: "Record verified commit hash in settings", status: "ready" },
          ].map((step) => (
            <div key={step.step} className="flex items-center gap-4 py-3 px-4 bg-background rounded border border-border">
              <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                <span className="text-xs font-mono text-muted-foreground">{step.step}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{step.name}</p>
                <p className="text-[11px] font-mono text-muted-foreground">{step.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                {step.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety note */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-start gap-3">
          <Wrench className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-bold text-foreground text-sm">Safe-First Design</p>
            <p>The running executable remains functional until the new one is proven to work. If any step fails, the running binary is untouched. If replacement fails mid-swap, the .old backup exists and is offered on next startup.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RebuildPage;
