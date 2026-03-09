import { Activity, Check, X, FileCode } from "lucide-react";
import { SectionHeader, StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { mockPendingWrites } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/dashboard/PageTransition";
import GitHubGate from "@/components/dashboard/GitHubGate";
import { motion } from "framer-motion";

const DiffReviewPage = () => {
  return (
    <GitHubGate>
      <PageTransition>
        <div className="space-y-8">
          <SectionHeader
            title="Diff Review"
            description="Agent writes to src/ are queued here — approve or reject before disk write"
          />

          <div className="flex flex-wrap gap-2">
            <StatusBadge
              status={mockPendingWrites.length > 0 ? "warning" : "online"}
              label={`${mockPendingWrites.length} PENDING REVIEWS`}
            />
          </div>

          <div className="space-y-4">
            {mockPendingWrites.map((pw, i) => (
              <motion.div
                key={pw.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, type: "spring" as const, stiffness: 300, damping: 25 }}
                className="glass-card rounded-2xl overflow-hidden border-warning/15"
              >
                <div className="flex items-center justify-between p-5 border-b border-[hsl(0_0%_100%/0.04)]">
                  <div className="flex items-center gap-3">
                    <LiquidIcon color="warning" size="sm" bounce={false}>
                      <FileCode className="h-4 w-4" />
                    </LiquidIcon>
                    <div>
                      <p className="text-sm font-mono font-medium text-foreground">{pw.path}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 tracking-wide">{pw.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{new Date(pw.timestamp).toLocaleTimeString()}</span>
                    <Button size="sm" className="h-7 text-xs font-mono bg-success/15 border border-success/25 text-success hover:bg-success/25">
                      <Check className="h-3 w-3 mr-1" />Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs font-mono border-destructive/25 text-destructive hover:bg-destructive/10">
                      <X className="h-3 w-3 mr-1" />Reject
                    </Button>
                  </div>
                </div>
                <div className="p-4 glass-subtle font-mono text-xs overflow-x-auto">
                  <pre className="whitespace-pre leading-relaxed">
                    {pw.diff.split("\n").map((line, li) => {
                      let lineClass = "text-muted-foreground";
                      if (line.startsWith("+") && !line.startsWith("+++")) lineClass = "text-success";
                      else if (line.startsWith("-") && !line.startsWith("---")) lineClass = "text-destructive";
                      else if (line.startsWith("@@")) lineClass = "text-primary";
                      return (
                        <div key={li} className={`${lineClass} px-2 rounded ${
                          line.startsWith("+") && !line.startsWith("+++") ? "bg-success/5" :
                          line.startsWith("-") && !line.startsWith("---") ? "bg-destructive/5" : ""
                        }`}>{line}</div>
                      );
                    })}
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>

          {mockPendingWrites.length === 0 && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <LiquidIcon color="neutral" size="lg" bounce={false} className="mx-auto mb-4 opacity-40">
                <Activity className="h-6 w-6" />
              </LiquidIcon>
              <p className="text-sm text-muted-foreground">No pending reviews</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">Agent writes to src/ will appear here for approval</p>
            </div>
          )}
        </div>
      </PageTransition>
    </GitHubGate>
  );
};

export default DiffReviewPage;
