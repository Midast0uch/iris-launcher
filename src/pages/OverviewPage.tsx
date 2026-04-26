import { Activity, Cpu, HardDrive, Radio, Shield, Clock, WifiOff, Play, Loader2 } from "lucide-react";
import { useState } from "react";
import { MetricCard, SectionHeader, StatusBadge, DataRow } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { AgentOrb } from "@/components/dashboard/AgentOrb";
import { toast } from "@/hooks/use-toast";
import { useUptime } from "@/hooks/use-uptime";
import { useIRISStatus } from "@/hooks/use-iris-status";
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
  const { identity, mode } = useApp();
  const { launcher, git, online, loading } = useIRISStatus();
  const uptime = useUptime(0);
  const [launchingWidget, setLaunchingWidget] = useState(false);

  const handleLaunchWidget = async () => {
    setLaunchingWidget(true);
    try {
      // Tauri v2: detect via the official isTauri() utility, NOT window.__TAURI__
      // (that global was removed in v2 — the check now lives on globalThis.isTauri).
      const { invoke, isTauri } = await import("@tauri-apps/api/core");

      if (isTauri()) {
        const launched = await invoke<string>("launch_iris_widget");
        toast({
          title: "IRIS Widget launching",
          description: `Started: ${launched}. Window appears in ~10s (cold start).`,
        });
      } else {
        // Standalone web dev: open the Next.js dev server in a new tab
        const url = import.meta.env.VITE_IRIS_APP_URL || "http://localhost:3000";
        window.open(url, "_blank");
        toast({ title: "Opening IRIS Widget", description: url });
      }
    } catch (err) {
      toast({
        title: "Launch failed",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      // Small delay so the spinner is visible even on instant spawns
      setTimeout(() => setLaunchingWidget(false), 1500);
    }
  };

  const agentActive = launcher?.agentActive ?? false;
  const driveConnected = launcher?.driveConnected ?? false;
  const pendingWriteCount = launcher?.pendingWrites ?? 0;
  const version = launcher?.version ?? "—";
  const sourceValid = launcher?.sourceValid ?? false;

  return (
    <PageTransition variant="blur">
      <div className="space-y-8">
        <SectionHeader
          title="System Overview"
          description="IRIS backend status and diagnostics"
          action={
            <div className="flex items-center gap-3">
              {!online && !loading && (
                <span className="flex items-center gap-1.5 text-xs font-mono text-warning">
                  <WifiOff className="h-3 w-3" /> Backend offline
                </span>
              )}
              <AgentOrb active={agentActive} size="md" />
              <span className="text-xs font-mono text-success">
                {agentActive ? "Agent Active" : "Agent Idle"}
              </span>
              <motion.button
                onClick={handleLaunchWidget}
                disabled={launchingWidget}
                whileHover={!launchingWidget ? { y: -1, transition: { type: "spring", stiffness: 400, damping: 22 } } : undefined}
                whileTap={!launchingWidget ? { scale: 0.97 } : undefined}
                className="glass-card ml-2 inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-mono uppercase tracking-[0.18em] text-foreground/80 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
              >
                <LiquidIcon
                  color={launchingWidget ? "primary" : "accent"}
                  size="sm"
                  bounce={!launchingWidget}
                  className="!h-6 !w-6"
                >
                  {launchingWidget ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                </LiquidIcon>
                <span>{launchingWidget ? "Launching" : "Launch Widget"}</span>
              </motion.button>
            </div>
          }
        />

        <motion.div className="flex flex-wrap gap-2" variants={stagger} initial="hidden" animate="show">
          <StatusBadge status={online ? "online" : "offline"} label={online ? "BACKEND ONLINE" : "BACKEND OFFLINE"} />
          <StatusBadge status={agentActive ? "online" : "offline"} label={agentActive ? "AGENT ACTIVE" : "AGENT IDLE"} />
          <StatusBadge status={driveConnected ? "online" : "warning"} label={driveConnected ? "DRIVE OK" : "DRIVE DISCONNECTED"} />
          {pendingWriteCount > 0 && (
            <StatusBadge status="warning" label={`${pendingWriteCount} PENDING WRITES`} />
          )}
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger} initial="hidden" animate="show">
          <MetricCard
            label="Mode"
            value={(mode || "personal").toUpperCase()}
            icon={<Shield className="h-4 w-4" />}
            accent={mode === "developer" ? "accent" : "primary"}
            subtitle={`${mode === "developer" ? "Developer" : "Personal"} mode`}
          />
          <MetricCard
            label="Uptime"
            value={launcher?.uptime ?? uptime}
            icon={<Clock className="h-4 w-4" />}
            accent="success"
            subtitle="Backend uptime"
          />
          <MetricCard
            label="Pending Reviews"
            value={pendingWriteCount}
            icon={<Activity className="h-4 w-4" />}
            accent={pendingWriteCount > 0 ? "warning" : "success"}
            subtitle="Diff reviews queued"
          />
          <MetricCard
            label="Node ID"
            value={identity ? identity.nodeId.slice(0, 8) : "—"}
            icon={<Radio className="h-4 w-4" />}
            accent="primary"
            subtitle="Post-quantum identity"
          />
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={stagger} initial="hidden" animate="show">
          <motion.div variants={item} className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-3">
              <LiquidIcon color="primary" size="sm"><Cpu className="h-4 w-4" /></LiquidIcon>
              System Health
            </h3>
            <div className="space-y-0">
              <DataRow label="Source Valid" value={loading ? "…" : sourceValid ? "✓ Valid" : "✗ Invalid"} />
              <DataRow label="Drive Status" value={loading ? "…" : driveConnected ? "Connected" : "Disconnected"} />
              <DataRow label="Version" value={version} />
              <DataRow label="Biometric" value={identity ? "Active (TPM)" : "No identity"} />
              <DataRow label="Backend" value={loading ? "Connecting…" : online ? "Online" : "Offline"} />
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-3">
              <LiquidIcon color="primary" size="sm"><HardDrive className="h-4 w-4" /></LiquidIcon>
              Git Status
            </h3>
            <div className="space-y-0">
              <DataRow label="Branch" value={git?.branch ?? (loading ? "…" : "—")} />
              <DataRow label="State" value={git ? (git.clean ? "Clean" : "Uncommitted changes") : (loading ? "…" : "—")} />
              <DataRow label="Last Commit" value={git?.lastCommit ?? "—"} />
              <DataRow label="Message" value={git?.lastCommitMessage
                ? <span className="text-xs truncate max-w-[200px] inline-block">{git.lastCommitMessage}</span>
                : "—"
              } />
              <DataRow label="Last Good" value={git?.lastGoodCommit ?? "—"} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default OverviewPage;
