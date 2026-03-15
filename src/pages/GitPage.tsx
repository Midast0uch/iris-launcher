import { FolderGit2, GitCommit, RotateCcw, AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { SectionHeader, DataRow, StatusBadge, MetricCard } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/dashboard/PageTransition";
import GitHubGate from "@/components/dashboard/GitHubGate";
import { motion } from "framer-motion";
import { useState } from "react";
import { useGitStatus, useGitLog, useCommitAll, useRollback, useBackendOnline } from "@/hooks/use-iris-backend";

const GitPage = () => {
  const { data: online } = useBackendOnline();
  const { data: statusData, isLoading: statusLoading, error: statusError } = useGitStatus();
  const { data: logData, isLoading: logLoading } = useGitLog(10);
  const commitAll = useCommitAll();
  const rollback = useRollback();
  const [commitMessage, setCommitMessage] = useState("");

  const gitStatus = statusData?.error ? null : statusData;
  const commits = logData?.commits ?? [];

  const handleCommitAll = () => {
    const msg = commitMessage.trim() || "user: manual commit from iris-launcher";
    commitAll.mutate(msg, {
      onSuccess: () => setCommitMessage(""),
    });
  };

  const handleRollback = () => {
    if (!gitStatus?.lastGoodCommit) return;
    rollback.mutate(gitStatus.lastGoodCommit);
  };

  return (
    <GitHubGate>
      <PageTransition variant="slide-up">
        <div className="space-y-8">
          <SectionHeader
            title="Git & Source Control"
            description="Developer Mode — every agent write is a recoverable git commit"
            action={
              <div className="flex gap-2 items-center">
                {online === false && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-warning">
                    <WifiOff className="h-3 w-3" />IRIS offline
                  </span>
                )}
                {online && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-success">
                    <Wifi className="h-3 w-3" />Live
                  </span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs border-primary/30 text-primary hover:bg-primary/10"
                  disabled={!gitStatus || commitAll.isPending}
                  onClick={handleCommitAll}
                >
                  <GitCommit className="h-3.5 w-3.5 mr-1.5" />
                  {commitAll.isPending ? "Committing..." : "Commit All"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-mono text-xs border-warning/30 text-warning hover:bg-warning/10"
                  disabled={!gitStatus?.lastGoodCommit || rollback.isPending}
                  onClick={handleRollback}
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  {rollback.isPending ? "Rolling back..." : "Rollback to Good"}
                </Button>
              </div>
            }
          />

          {statusLoading && (
            <div className="text-xs font-mono text-muted-foreground animate-pulse">Loading git status…</div>
          )}

          {(statusError || statusData?.error) && (
            <div className="glass-card rounded-2xl p-4 border-destructive/20">
              <p className="text-xs font-mono text-destructive">
                Failed to load git status — is IRIS backend running?
              </p>
            </div>
          )}

          {gitStatus && (
            <>
              <div className="flex flex-wrap gap-2">
                <StatusBadge
                  status={gitStatus.clean ? "online" : "warning"}
                  label={gitStatus.clean ? "CLEAN" : "UNCOMMITTED CHANGES"}
                />
                <StatusBadge status="online" label={`BRANCH: ${gitStatus.branch.toUpperCase()}`} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MetricCard
                  label="Last Commit"
                  value={gitStatus.lastCommit}
                  icon={<GitCommit className="h-4 w-4" />}
                  accent="primary"
                  subtitle={gitStatus.lastCommitMessage}
                />
                <MetricCard
                  label="Last Good"
                  value={gitStatus.lastGoodCommit}
                  icon={<FolderGit2 className="h-4 w-4" />}
                  accent="success"
                  subtitle="Verified build"
                />
                <MetricCard
                  label="Uncommitted"
                  value={gitStatus.uncommittedFiles.length}
                  icon={<AlertTriangle className="h-4 w-4" />}
                  accent={gitStatus.uncommittedFiles.length > 0 ? "warning" : "success"}
                  subtitle="Modified files"
                />
              </div>

              {gitStatus.uncommittedFiles.length > 0 && (
                <div className="glass-card rounded-2xl p-6 border-warning/15 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-3">
                    <LiquidIcon color="warning" size="sm">
                      <AlertTriangle className="h-4 w-4" />
                    </LiquidIcon>
                    Uncommitted Files
                  </h3>
                  <div className="space-y-1">
                    {gitStatus.uncommittedFiles.map((file) => (
                      <div key={file} className="flex items-center gap-2 py-1.5 px-3 glass-subtle rounded-xl">
                        <span className="text-[10px] font-mono text-warning">M</span>
                        <span className="text-xs font-mono text-foreground">{file}</span>
                      </div>
                    ))}
                  </div>
                  {/* Quick commit with custom message */}
                  <div className="flex gap-2">
                    <input
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      placeholder="Commit message (optional)"
                      className="flex-1 bg-transparent border border-border rounded-xl px-3 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                      onKeyDown={(e) => e.key === "Enter" && handleCommitAll()}
                    />
                    <Button
                      size="sm"
                      className="font-mono text-xs bg-primary/15 border border-primary/25 text-primary hover:bg-primary/25"
                      onClick={handleCommitAll}
                      disabled={commitAll.isPending}
                    >
                      <GitCommit className="h-3 w-3 mr-1" />
                      Commit
                    </Button>
                  </div>
                  {commitAll.isError && (
                    <p className="text-xs font-mono text-destructive">
                      Commit failed: {(commitAll.error as Error).message}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5">Commit History</h3>
            {logLoading ? (
              <div className="text-xs font-mono text-muted-foreground animate-pulse">Loading…</div>
            ) : (
              <div className="space-y-1">
                {commits.map((commit, i) => (
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
                    {commit.auto && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md glass-subtle text-muted-foreground">
                        AUTO
                      </span>
                    )}
                  </motion.div>
                ))}
                {commits.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No commits found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </GitHubGate>
  );
};

export default GitPage;
