import { useState } from "react";
import { Network, Globe, Monitor, Shield, Laptop, Server, Smartphone, CheckCircle, XCircle, RefreshCw, Signal } from "lucide-react";
import { SectionHeader, StatusBadge, DataRow } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { AgentOrb } from "@/components/dashboard/AgentOrb";
import { motion } from "framer-motion";

interface TailscaleNode {
  id: string; name: string; ip: string; os: string; online: boolean; lastSeen: string; isExit: boolean;
}

const mockNodes: TailscaleNode[] = [
  { id: "n1", name: "iris-desktop", ip: "100.64.0.1", os: "Windows 11", online: true, lastSeen: "Now", isExit: false },
  { id: "n2", name: "iris-macbook", ip: "100.64.0.2", os: "macOS 15", online: true, lastSeen: "Now", isExit: false },
  { id: "n3", name: "iris-server", ip: "100.64.0.3", os: "Ubuntu 24.04", online: true, lastSeen: "Now", isExit: true },
  { id: "n4", name: "iris-phone", ip: "100.64.0.4", os: "iOS 19", online: false, lastSeen: "2h ago", isExit: false },
  { id: "n5", name: "iris-nas", ip: "100.64.0.5", os: "Synology DSM", online: true, lastSeen: "Now", isExit: false },
];

type ConnectionStatus = "disconnected" | "connecting" | "connected";

const osIcon = (os: string) => {
  if (os.includes("Windows") || os.includes("macOS")) return <Laptop className="h-4 w-4" />;
  if (os.includes("Ubuntu") || os.includes("Synology")) return <Server className="h-4 w-4" />;
  if (os.includes("iOS") || os.includes("Android")) return <Smartphone className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
};

const TailscalePage = () => {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [nodes, setNodes] = useState<TailscaleNode[]>([]);

  const handleConnect = () => {
    setStatus("connecting");
    setTimeout(() => { setStatus("connected"); setNodes(mockNodes); }, 2200);
  };

  const handleDisconnect = () => { setStatus("disconnected"); setNodes([]); };

  const onlineCount = nodes.filter((n) => n.online).length;

  return (
    <PageTransition variant="fade">
      <div className="space-y-8">
        <SectionHeader
          title="Tailscale Network"
          description="Mesh VPN connectivity and node status"
          action={status === "connected" ? (
            <Button variant="outline" size="sm" onClick={handleDisconnect} className="font-mono text-xs border-destructive/30 text-destructive hover:bg-destructive/10">Disconnect</Button>
          ) : undefined}
        />

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={status === "connected" ? "online" : status === "connecting" ? "warning" : "offline"} label={status === "connected" ? "TAILSCALE CONNECTED" : status === "connecting" ? "CONNECTING..." : "TAILSCALE OFFLINE"} />
          {status === "connected" && (
            <>
              <StatusBadge status="online" label={`${onlineCount} NODES ONLINE`} />
              <StatusBadge status="dormant" label="MAGICDNS ACTIVE" />
            </>
          )}
        </div>

        {status === "disconnected" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center justify-center py-16">
            <LiquidIcon color="primary" size="xl" bounce className="mb-6">
              <Network className="h-10 w-10" />
            </LiquidIcon>
            <h2 className="text-lg font-semibold text-foreground mb-2">Not Connected</h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-8 tracking-wide">Connect to your Tailscale network to enable encrypted mesh connectivity between your IRIS nodes.</p>
            <Button onClick={handleConnect} className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 px-8" size="lg">
              <Globe className="h-4 w-4 mr-2" />Connect to Tailscale
            </Button>
            <p className="text-[10px] text-muted-foreground mt-4 font-mono tracking-wider">WireGuard® · Zero-config mesh · MagicDNS</p>
          </motion.div>
        )}

        {status === "connecting" && (
          <div className="flex flex-col items-center justify-center py-16 animate-enter space-y-8">
            <AgentOrb active size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Connecting to Tailnet</h2>
              <p className="text-sm text-muted-foreground font-mono">Establishing WireGuard tunnels...</p>
            </div>
            <div className="space-y-3 w-full max-w-xs">
              {["Authenticating with control plane", "Exchanging WireGuard keys", "Discovering peers"].map((label, i) => (
                <motion.div key={label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.6, type: "spring" as const, stiffness: 300, damping: 25 }} className="flex items-center gap-3 text-xs font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" /><span className="text-primary">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {status === "connected" && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-3">
                <LiquidIcon color="primary" size="sm"><Signal className="h-4 w-4" /></LiquidIcon>
                Connection Details
              </h3>
              <DataRow label="Tailnet" value="iris-net.ts.net" />
              <DataRow label="This Device" value="iris-desktop (100.64.0.1)" />
              <DataRow label="Protocol" value="WireGuard (UDP 41641)" />
              <DataRow label="MagicDNS" value="Enabled" />
              <DataRow label="Exit Node" value="iris-server (100.64.0.3)" />
            </div>

            <div className="glass-card rounded-2xl divide-y divide-border">
              <div className="p-5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-3">
                  <LiquidIcon color="primary" size="sm"><Network className="h-4 w-4" /></LiquidIcon>
                  Network Nodes
                </h3>
                <Button variant="outline" size="sm" className="h-7 text-xs font-mono"><RefreshCw className="h-3 w-3 mr-1" />Refresh</Button>
              </div>
              {nodes.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: "spring" as const, stiffness: 300, damping: 25 }}
                  className="flex items-center justify-between p-4 hover:bg-[hsl(0_0%_100%/0.02)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LiquidIcon color={node.online ? "success" : "neutral"} size="sm" bounce={false}>
                      {osIcon(node.os)}
                    </LiquidIcon>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono font-medium text-foreground">{node.name}</p>
                        {node.isExit && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md liquid-icon-accent text-accent">EXIT</span>}
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground">{node.ip} · {node.os}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{node.lastSeen}</span>
                    {node.online ? <CheckCircle className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <LiquidIcon color="warning" size="sm" bounce={false}><Shield className="h-4 w-4" /></LiquidIcon>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground text-sm">Network Security</p>
                  <p className="tracking-wide">All traffic between nodes is encrypted end-to-end via WireGuard. Key rotation is handled automatically by the Tailscale control plane. No traffic passes through central servers.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default TailscalePage;
