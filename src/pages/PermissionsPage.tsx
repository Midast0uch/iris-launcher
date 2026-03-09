import { Shield, Wifi, WifiOff } from "lucide-react";
import { SectionHeader, StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { mockNetworkPermissions } from "@/lib/mock-data";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const PermissionsPage = () => {
  const [permissions, setPermissions] = useState(mockNetworkPermissions);

  const togglePermission = (skill: string) => {
    setPermissions(prev =>
      prev.map(p => p.skill === skill ? { ...p, allowed: !p.allowed } : p)
    );
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Network Permissions"
        description="Per-skill network access control — enforced in Rust backend"
      />

      <div className="flex flex-wrap gap-2">
        <StatusBadge
          status={permissions.filter(p => p.allowed).length > 0 ? "warning" : "online"}
          label={`${permissions.filter(p => p.allowed).length} SKILLS WITH NETWORK`}
        />
      </div>

      <div className="bg-card rounded-lg border border-border divide-y divide-border">
        {permissions.map((perm) => (
          <div key={perm.skill} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                perm.allowed ? "bg-primary/15 border border-primary/30" : "bg-secondary border border-border"
              }`}>
                {perm.allowed ? (
                  <Wifi className="h-4 w-4 text-primary" />
                ) : (
                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-mono font-medium text-foreground">{perm.skill}</p>
                {perm.lastUsed && (
                  <p className="text-[10px] font-mono text-muted-foreground">
                    Last used: {new Date(perm.lastUsed).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-mono ${perm.allowed ? "text-primary" : "text-muted-foreground"}`}>
                {perm.allowed ? "ALLOWED" : "BLOCKED"}
              </span>
              <Switch
                checked={perm.allowed}
                onCheckedChange={() => togglePermission(perm.skill)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-warning mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-bold text-foreground text-sm">Security Note</p>
            <p>Permissions are stored in launcher_settings.json (OS app data) — not in IRIS-source. The agent cannot modify its own permissions. Every network call from any skill passes through check_network_permission() in the Rust backend before any HTTP request is made.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
