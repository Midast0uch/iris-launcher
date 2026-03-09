import { FolderGit2, GitCommit, RotateCcw, AlertTriangle } from "lucide-react";
import { SectionHeader, DataRow, StatusBadge, MetricCard } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { mockGitStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/dashboard/PageTransition";
import GitHubGate from "@/components/dashboard/GitHubGate";
import { motion } from "framer-motion";

const GitPage = () => {
  return (
    <GitHubGate>
      <PageTransition variant="slide-up">
        <div className="space-y-8">
          <SectionHeader
            title="Git & Source Control"
            description="Developer Mode — every agent write is a recoverable git commit"
            action={
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="font-mono text-xs border-primary/30 text-primary hover:bg-primary/10"><GitCommit className="h-3.5 w-3.5 mr-1.5" />Commit All</Button>
                <Button variant="outline" size="sm" className="font-mono text-xs border-warning/30 text-warning hover:bg-warning/10"><RotateCcw className="h-3.5 w-3.5 mr-1.5" />Rollback to Good</Button>
              </div>
            }
          />

          <div className="flex flex-wrap gap-2">
            <StatusBadge status={mockGitStatus.clean ? "online" : "warning"} label={mockGitStatus.clean ? "CLEAN" : "UNCOMMITTED CHANGES"} />
            <StatusBadge status="online" label={`BRANCH: ${mockGitStatus.branch.toUpperCase()}`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="Last Commit" value={mockGitStatus.lastCommit} icon={<GitCommit className="h-4 w-4" />} accent="primary" subtitle={mockGitStatus.lastCommitMessage} />
            <MetricCard label="Last Good" value={mockGitStatus.lastGoodCommit} icon={<FolderGit2 className="h-4 w-4" />} accent="success" subtitle="Verified build" />
            <MetricCard label="Uncommitted" value={mockGitStatus.uncommittedFiles.length} icon={<AlertTriangle className="h-4 w-4" />} accent={mockGitStatus.uncommittedFiles.length > 0 ? "warning" : "success"} subtitle="Modified files" />
          </div>

          {mockGitStatus.uncommittedFiles.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border-warning/15">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-3">
                <LiquidIcon color="warning" size="sm"><AlertTriangle className="h-4 w-4" /></LiquidIcon>
                Uncommitted Files
              </h3>
              <div className="space-y-1">
                {mockGitStatus.uncommittedFiles.map((file) => (
                  <div key={file} className="flex items-center gap-2 py-1.5 px-3 glass-subtle rounded-xl">
                    <span className="text-[10px] font-mono text-warning">M</span>
                    <span className="text-xs font-mono text-foreground">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5">Commit History</h3>
            <div className="space-y-1">
              {[
                { hash: "e4a7c3f", message: "agent: update web_search skill parameters", time: "2 hours ago", auto: true },
                { hash: "c1b8d5e", message: "agent: add retry logic to api_call", time: "4 hours ago", auto: true },
                { hash: "b2d1a9e", message: "rebuild: verified build ✓", time: "5 hours ago", auto: false },
                { hash: "a9f3e2d", message: "agent: refactor file_download error handling", time: "6 hours ago", auto: true },
                { hash: "8c7b1a4", message: "user: manual commit before experiment", time: "1 day ago", auto: false },
              ].map((commit, i) => (
                <motion.div
                  key={commit.hash}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, type: "spring" as const, stiffness: 300, damping: 25 }}
                  className="flex items-center gap-3 py-2.5 border-b border-border last:border-0 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <span className="font-mono text-xs text-primary w-16">{commit.hash}</span>
                  <span className="text-xs font-mono text-foreground flex-1">{commit.message}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{commit.time}</span>
                  {commit.auto && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md glass-subtle text-muted-foreground">AUTO</span>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </GitHubGate>
  );
};

export default GitPage;
