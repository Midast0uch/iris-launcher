import { Activity, Check, X, FileCode } from "lucide-react";
import { SectionHeader, StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { mockPendingWrites } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/dashboard/PageTransition";

const DiffReviewPage = () => {
  return (
    <PageTransition><div className="space-y-8">
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
        {mockPendingWrites.map((pw) => (
          <div key={pw.id} className="glass rounded-xl border-warning/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <FileCode className="h-4 w-4 text-warning" />
                <div>
                  <p className="text-sm font-mono font-medium text-foreground">{pw.path}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{pw.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {new Date(pw.timestamp).toLocaleTimeString()}
                </span>
                <Button size="sm" className="h-7 text-xs font-mono bg-success/20 border border-success/30 text-success hover:bg-success/30">
                  <Check className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="h-7 text-xs font-mono border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
            {/* Diff */}
            <div className="p-4 bg-background font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre leading-relaxed">
                {pw.diff.split("\n").map((line, i) => {
                  let lineClass = "text-muted-foreground";
                  if (line.startsWith("+") && !line.startsWith("+++")) lineClass = "text-success";
                  else if (line.startsWith("-") && !line.startsWith("---")) lineClass = "text-destructive";
                  else if (line.startsWith("@@")) lineClass = "text-primary";
                  return (
                    <div key={i} className={`${lineClass} px-2 ${
                      line.startsWith("+") && !line.startsWith("+++") ? "bg-success/5" :
                      line.startsWith("-") && !line.startsWith("---") ? "bg-destructive/5" : ""
                    }`}>
                      {line}
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {mockPendingWrites.length === 0 && (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No pending reviews</p>
          <p className="text-xs text-muted-foreground mt-1">Agent writes to src/ will appear here for approval</p>
        </div>
      )}
    </div></PageTransition>
  );
};

export default DiffReviewPage;
