import { Activity, Cpu, HardDrive, Radio, Shield, Clock } from "lucide-react";
import { MetricCard, SectionHeader, StatusBadge, DataRow } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { mockLauncherStatus, mockGitStatus, mockPendingWrites } from "@/lib/mock-data";
import { AgentOrb } from "@/components/dashboard/AgentOrb";
import { useUptime } from "@/hooks/use-uptime";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } },
};

const OverviewPage = () => {
  const uptime = useUptime(16320);
  const { identity, mode } = useApp();

  return (
    <PageTransition variant="blur">
      <div className="space-y-8">
        <SectionHeader
          title="System Overview"
          description="IRIS Launcher backend status and diagnostics"
          action={
            <div className="flex items-center gap-3">
              <AgentOrb active={mockLauncherStatus.agentActive} size="md" />
              <span className="text-xs font-mono text-success">
                {mockLauncherStatus.agentActive ? "Agent Active" : "Agent Idle"}
              </span>
            </div>
          }
        />

        <motion.div className="flex flex-wrap gap-2" variants={stagger} initial="hidden" animate="show">
          <StatusBadge status="online" label="SYSTEM ONLINE" />
          <StatusBadge status={mockLauncherStatus.agentActive ? "online" : "offline"} label={mockLauncherStatus.agentActive ? "AGENT ACTIVE" : "AGENT IDLE"} />
          <StatusBadge status={mockLauncherStatus.driveConnected ? "online" : "warning"} label={mockLauncherStatus.driveConnected ? "DRIVE OK" : "DRIVE DISCONNECTED"} />
          {mockLauncherStatus.pendingWrites > 0 && (
            <StatusBadge status="warning" label={`${mockLauncherStatus.pendingWrites} PENDING WRITES`} />
          )}
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger} initial="hidden" animate="show">
          <MetricCard label="Mode" value={(mode || "personal").toUpperCase()} icon={<Shield className="h-4 w-4" />} accent={mode === "developer" ? "accent" : "primary"} subtitle={`${mode === "developer" ? "Developer" : "Personal"} mode`} />
          <MetricCard label="Uptime" value={uptime} icon={<Clock className="h-4 w-4" />} accent="success" subtitle="Live counter" />
          <MetricCard label="Pending Reviews" value={mockPendingWrites.length} icon={<Activity className="h-4 w-4" />} accent={mockPendingWrites.length > 0 ? "warning" : "success"} subtitle="Diff reviews queued" />
          <MetricCard label="Node ID" value={identity ? identity.nodeId.slice(0, 8) : "—"} icon={<Radio className="h-4 w-4" />} accent="primary" subtitle="Post-quantum identity" />
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={stagger} initial="hidden" animate="show">
          <motion.div variants={item} className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-3">
              <LiquidIcon color="primary" size="sm"><Cpu className="h-4 w-4" /></LiquidIcon>
              System Health
            </h3>
            <div className="space-y-0">
              <DataRow label="Source Valid" value={mockLauncherStatus.sourceValid ? "✓ Valid" : "✗ Invalid"} />
              <DataRow label="Drive Status" value={mockLauncherStatus.driveConnected ? "Connected" : "Disconnected"} />
              <DataRow label="Crash Flag" value="Clear" />
              <DataRow label="Version" value={mockLauncherStatus.version} />
              <DataRow label="Biometric" value={identity ? "Active (TPM)" : "No identity"} />
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-3">
              <LiquidIcon color="primary" size="sm"><HardDrive className="h-4 w-4" /></LiquidIcon>
              Git Status
            </h3>
            <div className="space-y-0">
              <DataRow label="Branch" value={mockGitStatus.branch} />
              <DataRow label="State" value={mockGitStatus.clean ? "Clean" : "Uncommitted changes"} />
              <DataRow label="Last Commit" value={mockGitStatus.lastCommit} />
              <DataRow label="Message" value={<span className="text-xs truncate max-w-[200px] inline-block">{mockGitStatus.lastCommitMessage}</span>} />
              <DataRow label="Last Good" value={mockGitStatus.lastGoodCommit} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-5">Recent Activity</h3>
          <div className="space-y-1 font-mono text-xs">
            {[
              { time: "14:25", event: "Pending write queued: src/identity.rs", type: "warning" as const },
              { time: "14:22", event: "Pending write queued: src/commands.rs", type: "warning" as const },
              { time: "14:10", event: "web_search skill accessed network", type: "primary" as const },
              { time: "13:45", event: "api_call skill accessed network", type: "primary" as const },
              { time: "10:15", event: "Rebuild completed successfully", type: "success" as const },
              { time: "10:14", event: "Cargo build triggered by user", type: "primary" as const },
              { time: "08:30", event: "Session started — identity loaded from keychain", type: "success" as const },
            ].map((entry, i) => {
              const colors = { warning: "text-warning", primary: "text-primary", success: "text-success" };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.04, type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center gap-3 py-2 border-b border-border last:border-0 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <span className="text-muted-foreground w-12">{entry.time}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${colors[entry.type].replace("text-", "bg-")}`} />
                  <span className={colors[entry.type]}>{entry.event}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default OverviewPage;
