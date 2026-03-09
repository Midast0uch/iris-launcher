import { Fingerprint, Key, Radio, ShieldCheck, Copy, Eye, EyeOff } from "lucide-react";
import { SectionHeader, DataRow, StatusBadge, MetricCard } from "@/components/dashboard/DashboardPrimitives";
import { mockIdentity } from "@/lib/mock-data";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const IdentityPage = () => {
  const [seedRevealed, setSeedRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const mockSeedPhrase = [
    "quantum", "shield", "orbit", "lattice",
    "cipher", "nexus", "vector", "prism",
    "forge", "pulse", "drift", "anchor",
  ];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Post-Quantum Identity"
        description="Dilithium3 keypair with biometric protection via OS keychain"
      />

      <div className="flex flex-wrap gap-2">
        <StatusBadge status="online" label="IDENTITY ACTIVE" />
        <StatusBadge status={mockIdentity.biometricActive ? "online" : "offline"} label={mockIdentity.biometricActive ? "BIOMETRIC ON" : "BIOMETRIC OFF"} />
        <StatusBadge status="dormant" label="TORUS DORMANT" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Node ID" value={mockIdentity.nodeId.slice(0, 8)} icon={<Radio className="h-4 w-4" />} accent="primary" subtitle="Truncated — full 16 chars" />
        <MetricCard label="Algorithm" value="Dilithium3" icon={<ShieldCheck className="h-4 w-4" />} accent="accent" subtitle="NIST FIPS 204" />
        <MetricCard label="Created" value="Feb 15" icon={<Key className="h-4 w-4" />} accent="success" subtitle="2026" />
      </div>

      {/* Identity details */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-primary" />
          Identity Details
        </h3>
        <div className="space-y-0">
          <DataRow label="Full Node ID" value={mockIdentity.nodeId} />
          <DataRow label="Network Status" value={mockIdentity.networkStatus.toUpperCase()} />
          <DataRow label="Biometric Guard" value={mockIdentity.biometricActive ? "Active (Windows Hello / Touch ID)" : "Inactive"} />
          <DataRow label="Key Storage" value="OS Keychain (hardware-backed)" />
          <DataRow label="Created At" value={new Date(mockIdentity.createdAt).toLocaleString()} />
        </div>
      </div>

      {/* Public key */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Public Key</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-7 text-xs font-mono border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Copy className="h-3 w-3 mr-1" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <div className="bg-background rounded border border-border p-3 font-mono text-xs text-primary break-all leading-relaxed">
          {mockIdentity.publicKey}
        </div>
      </div>

      {/* Seed Phrase */}
      <div className="bg-card rounded-lg border border-warning/20 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Key className="h-4 w-4 text-warning" />
            Recovery Seed Phrase
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSeedRevealed(!seedRevealed)}
            className="h-7 text-xs font-mono border-warning/30 text-warning hover:bg-warning/10 hover:text-warning"
          >
            {seedRevealed ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {seedRevealed ? "Hide" : "Reveal (requires biometric)"}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground mb-4">
          12-word BIP-39 mnemonic. Never stored — derived on demand from keychain-protected private key.
        </p>
        {seedRevealed ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {mockSeedPhrase.map((word, i) => (
              <div key={i} className="bg-background rounded border border-warning/20 p-2 text-center">
                <span className="text-[10px] font-mono text-muted-foreground mr-1">{i + 1}.</span>
                <span className="text-sm font-mono text-warning">{word}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-background rounded border border-border p-2 text-center">
                <span className="text-[10px] font-mono text-muted-foreground mr-1">{i + 1}.</span>
                <span className="text-sm font-mono text-muted-foreground">••••••</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentityPage;
