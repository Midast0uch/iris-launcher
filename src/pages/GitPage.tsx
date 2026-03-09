import { FolderGit2, GitCommit, RotateCcw, AlertTriangle } from "lucide-react";
import { SectionHeader, DataRow, StatusBadge, MetricCard } from "@/components/dashboard/DashboardPrimitives";
import { mockGitStatus } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const GitPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Git & Source Control"
        description="Developer Mode — every agent write is a recoverable git commit"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="font-mono text-xs border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
              <GitCommit className="h-3.5 w-3.5 mr-1.5" />
              Commit All
            </Button>
            <Button variant="outline" size="sm" className="font-mono text-xs border-warning/30 text-warning hover:bg-warning/10 hover:text-warning">
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Rollback to Good
            </Button>
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

      {/* Uncommitted files */}
      {mockGitStatus.uncommittedFiles.length > 0 && (
        <div className="bg-card rounded-lg border border-warning/20 p-5">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Uncommitted Files
          </h3>
          <div className="space-y-1">
            {mockGitStatus.uncommittedFiles.map((file) => (
              <div key={file} className="flex items-center gap-2 py-1.5 px-3 bg-background rounded border border-border">
                <span className="text-[10px] font-mono text-warning">M</span>
                <span className="text-xs font-mono text-foreground">{file}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent commits mock */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Commit History</h3>
        <div className="space-y-3">
          {[
            { hash: "e4a7c3f", message: "agent: update web_search skill parameters", time: "2 hours ago", auto: true },
            { hash: "c1b8d5e", message: "agent: add retry logic to api_call", time: "4 hours ago", auto: true },
            { hash: "b2d1a9e", message: "rebuild: verified build ✓", time: "5 hours ago", auto: false },
            { hash: "a9f3e2d", message: "agent: refactor file_download error handling", time: "6 hours ago", auto: true },
            { hash: "8c7b1a4", message: "user: manual commit before experiment", time: "1 day ago", auto: false },
          ].map((commit) => (
            <div key={commit.hash} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
              <span className="font-mono text-xs text-primary w-16">{commit.hash}</span>
              <div className="flex-1">
                <span className="text-xs font-mono text-foreground">{commit.message}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{commit.time}</span>
              {commit.auto && (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary border border-border text-muted-foreground">AUTO</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GitPage;
