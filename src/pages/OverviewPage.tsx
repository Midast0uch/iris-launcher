import { Activity, Cpu, HardDrive, Radio, Shield, Clock } from "lucide-react";
import { MetricCard, SectionHeader, StatusBadge, DataRow } from "@/components/dashboard/DashboardPrimitives";
import { mockLauncherStatus, mockIdentity, mockGitStatus, mockPendingWrites } from "@/lib/mock-data";

const OverviewPage = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="System Overview"
        description="IRIS Launcher backend status and diagnostics"
      />

      {/* Status badges row */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="online" label="SYSTEM ONLINE" />
        <StatusBadge status={mockLauncherStatus.agentActive ? "online" : "offline"} label={mockLauncherStatus.agentActive ? "AGENT ACTIVE" : "AGENT IDLE"} />
        <StatusBadge status={mockLauncherStatus.driveConnected ? "online" : "warning"} label={mockLauncherStatus.driveConnected ? "DRIVE OK" : "DRIVE DISCONNECTED"} />
        <StatusBadge status="dormant" label="TORUS DORMANT" />
        {mockLauncherStatus.pendingWrites > 0 && (
          <StatusBadge status="warning" label={`${mockLauncherStatus.pendingWrites} PENDING WRITES`} />
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Mode"
          value={mockLauncherStatus.mode.toUpperCase()}
          icon={<Shield className="h-4 w-4" />}
          accent={mockLauncherStatus.mode === "developer" ? "accent" : "primary"}
          subtitle="Active project mode"
        />
        <MetricCard
          label="Uptime"
          value={mockLauncherStatus.uptime}
          icon={<Clock className="h-4 w-4" />}
          accent="success"
          subtitle="Current session"
        />
        <MetricCard
          label="Pending Reviews"
          value={mockPendingWrites.length}
          icon={<Activity className="h-4 w-4" />}
          accent={mockPendingWrites.length > 0 ? "warning" : "success"}
          subtitle="Diff reviews queued"
        />
        <MetricCard
          label="Node ID"
          value={mockIdentity.nodeId.slice(0, 8)}
          icon={<Radio className="h-4 w-4" />}
          accent="primary"
          subtitle="Post-quantum identity"
        />
      </div>

      {/* Two-column details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            System Health
          </h3>
          <div className="space-y-0">
            <DataRow label="Source Valid" value={mockLauncherStatus.sourceValid ? "✓ Valid" : "✗ Invalid"} />
            <DataRow label="Drive Status" value={mockLauncherStatus.driveConnected ? "Connected" : "Disconnected"} />
            <DataRow label="Crash Flag" value="Clear" />
            <DataRow label="Version" value={mockLauncherStatus.version} />
            <DataRow label="Biometric" value={mockIdentity.biometricActive ? "Active (TPM)" : "Inactive"} />
          </div>
        </div>

        {/* Git Quick Status */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-primary" />
            Git Status
          </h3>
          <div className="space-y-0">
            <DataRow label="Branch" value={mockGitStatus.branch} />
            <DataRow label="State" value={mockGitStatus.clean ? "Clean" : "Uncommitted changes"} />
            <DataRow label="Last Commit" value={mockGitStatus.lastCommit} />
            <DataRow label="Message" value={
              <span className="text-xs truncate max-w-[200px] inline-block">{mockGitStatus.lastCommitMessage}</span>
            } />
            <DataRow label="Last Good" value={mockGitStatus.lastGoodCommit} />
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-2 font-mono text-xs">
          {[
            { time: "14:25", event: "Pending write queued: src/identity.rs", type: "warning" as const },
            { time: "14:22", event: "Pending write queued: src/commands.rs", type: "warning" as const },
            { time: "14:10", event: "web_search skill accessed network", type: "primary" as const },
            { time: "13:45", event: "api_call skill accessed network", type: "primary" as const },
            { time: "10:15", event: "Rebuild completed successfully", type: "success" as const },
            { time: "10:14", event: "Cargo build triggered by user", type: "primary" as const },
            { time: "08:30", event: "Session started — identity loaded from keychain", type: "success" as const },
          ].map((entry, i) => {
            const colors = {
              warning: "text-warning",
              primary: "text-primary",
              success: "text-success",
            };
            return (
              <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border/30 last:border-0">
                <span className="text-muted-foreground w-12">{entry.time}</span>
                <span className={`h-1 w-1 rounded-full ${colors[entry.type].replace("text-", "bg-")}`} />
                <span className={colors[entry.type]}>{entry.event}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
