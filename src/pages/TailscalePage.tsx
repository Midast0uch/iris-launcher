import { useState } from "react";
import { Network, Globe, Monitor, Shield, Laptop, Server, Smartphone, CheckCircle, XCircle, RefreshCw, Signal } from "lucide-react";
import { SectionHeader, StatusBadge, DataRow } from "@/components/dashboard/DashboardPrimitives";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { AgentOrb } from "@/components/dashboard/AgentOrb";

interface TailscaleNode {
  id: string;
  name: string;
  ip: string;
  os: string;
  online: boolean;
  lastSeen: string;
  isExit: boolean;
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
    setTimeout(() => {
      setStatus("connected");
      setNodes(mockNodes);
    }, 2200);
  };

  const handleDisconnect = () => {
    setStatus("disconnected");
    setNodes([]);
  };

  const onlineCount = nodes.filter((n) => n.online).length;

  return (
    <PageTransition>
      <div className="space-y-8">
        <SectionHeader
          title="Tailscale Network"
          description="Mesh VPN connectivity and node status"
          action={
            status === "connected" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="font-mono text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                Disconnect
              </Button>
            ) : undefined
          }
        />

        <div className="flex flex-wrap gap-2">
          <StatusBadge
            status={status === "connected" ? "online" : status === "connecting" ? "warning" : "offline"}
            label={status === "connected" ? "TAILSCALE CONNECTED" : status === "connecting" ? "CONNECTING..." : "TAILSCALE OFFLINE"}
          />
          {status === "connected" && (
            <>
              <StatusBadge status="online" label={`${onlineCount} NODES ONLINE`} />
              <StatusBadge status="dormant" label="MAGICDNS ACTIVE" />
            </>
          )}
        </div>

        {/* Disconnected state */}
        {status === "disconnected" && (
          <div className="flex flex-col items-center justify-center py-16 animate-enter">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Network className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Not Connected</h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-8">
              Connect to your Tailscale network to enable encrypted mesh connectivity between your IRIS nodes.
            </p>
            <Button onClick={handleConnect} className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 px-8" size="lg">
              <Globe className="h-4 w-4 mr-2" />
              Connect to Tailscale
            </Button>
            <p className="text-[11px] text-muted-foreground mt-4 font-mono">WireGuard® · Zero-config mesh · MagicDNS</p>
          </div>
        )}

        {/* Connecting */}
        {status === "connecting" && (
          <div className="flex flex-col items-center justify-center py-16 animate-enter space-y-8">
            <AgentOrb active size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-foreground">Connecting to Tailnet</h2>
              <p className="text-sm text-muted-foreground font-mono">Establishing WireGuard tunnels...</p>
            </div>
            <div className="space-y-3 w-full max-w-xs">
              {["Authenticating with control plane", "Exchanging WireGuard keys", "Discovering peers"].map((label, i) => (
                <div key={label} className="flex items-center gap-3 text-xs font-mono animate-fade-in" style={{ animationDelay: `${i * 700}ms`, animationFillMode: "backwards" }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                  <span className="text-primary">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connected */}
        {status === "connected" && (
          <div className="animate-enter space-y-6">
            {/* Connection details */}
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Signal className="h-4 w-4 text-primary" />
                Connection Details
              </h3>
              <div className="space-y-0">
                <DataRow label="Tailnet" value="iris-net.ts.net" />
                <DataRow label="This Device" value="iris-desktop (100.64.0.1)" />
                <DataRow label="Protocol" value="WireGuard (UDP 41641)" />
                <DataRow label="MagicDNS" value="Enabled" />
                <DataRow label="Exit Node" value="iris-server (100.64.0.3)" />
              </div>
            </div>

            {/* Nodes list */}
            <div className="glass rounded-xl divide-y divide-[hsl(0_0%_100%/0.05)]">
              <div className="p-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Network className="h-4 w-4 text-primary" />
                  Network Nodes
                </h3>
                <Button variant="outline" size="sm" className="h-7 text-xs font-mono border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
              {nodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                      node.online ? "bg-success/15 border border-success/30 text-success" : "bg-secondary border border-border text-muted-foreground"
                    }`}>
                      {osIcon(node.os)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono font-medium text-foreground">{node.name}</p>
                        {node.isExit && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent">EXIT</span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {node.ip} · {node.os}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{node.lastSeen}</span>
                    {node.online ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Security note */}
            <div className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-warning mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-bold text-foreground text-sm">Network Security</p>
                  <p>All traffic between nodes is encrypted end-to-end via WireGuard. Key rotation is handled automatically by the Tailscale control plane. No traffic passes through central servers.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default TailscalePage;
