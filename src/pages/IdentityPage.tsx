import { useState, useCallback } from "react";
import { Fingerprint, Key, Radio, ShieldCheck, Copy, AlertTriangle, CheckCircle, Plus, ArrowRight, Download } from "lucide-react";
import { SectionHeader, DataRow, StatusBadge, MetricCard } from "@/components/dashboard/DashboardPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { AgentOrb } from "@/components/dashboard/AgentOrb";
import { useApp } from "@/contexts/AppContext";

const SEED_PHRASE = [
  "quantum", "shield", "orbit", "lattice",
  "cipher", "nexus", "vector", "prism",
  "forge", "pulse", "drift", "anchor",
];

function generateMockIdentity() {
  const nodeId = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const publicKey = "dil3-pk-" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  return { nodeId, publicKey, createdAt: new Date().toISOString() };
}

type Flow = "idle" | "generating" | "display" | "verify" | "complete" | "import" | "import-verifying";

const IdentityPage = () => {
  const { identity, setIdentity } = useApp();
  const [flow, setFlow] = useState<Flow>("idle");
  const [acknowledged, setAcknowledged] = useState(false);
  const [verifyWords, setVerifyWords] = useState(["", "", ""]);
  const [verifyError, setVerifyError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [importWords, setImportWords] = useState(Array(12).fill(""));
  const [importError, setImportError] = useState("");

  const verifyIndices = [3, 8, 12]; // 1-indexed

  const handleGenerate = useCallback(() => {
    setFlow("generating");
    setTimeout(() => setFlow("display"), 2800);
  }, []);

  const handleVerify = () => {
    const correct =
      verifyWords[0].toLowerCase().trim() === SEED_PHRASE[2] &&
      verifyWords[1].toLowerCase().trim() === SEED_PHRASE[7] &&
      verifyWords[2].toLowerCase().trim() === SEED_PHRASE[11];

    if (correct) {
      setVerifyError(false);
      const id = generateMockIdentity();
      setIdentity(id);
      setFlow("complete");
    } else {
      setVerifyError(true);
    }
  };

  const handleImport = () => {
    const filled = importWords.every((w) => w.trim().length > 0);
    if (!filled) {
      setImportError("Please fill in all 12 words.");
      return;
    }
    // In a real app we'd derive the key from the mnemonic
    setImportError("");
    setFlow("import-verifying");
    setTimeout(() => {
      const id = generateMockIdentity();
      setIdentity(id);
      setFlow("complete");
    }, 2000);
  };

  const handleCopy = () => {
    if (identity) {
      navigator.clipboard.writeText(identity.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Identity exists — show details
  if (identity && flow !== "complete") {
    return (
      <PageTransition>
        <div className="space-y-8">
          <SectionHeader
            title="Post-Quantum Identity"
            description="Dilithium3 keypair with biometric protection via OS keychain"
          />

          <div className="flex flex-wrap gap-2">
            <StatusBadge status="online" label="IDENTITY ACTIVE" />
            <StatusBadge status="online" label="BIOMETRIC ON" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="Node ID" value={identity.nodeId.slice(0, 8)} icon={<Radio className="h-4 w-4" />} accent="primary" subtitle="Truncated — full 16 chars" />
            <MetricCard label="Algorithm" value="Dilithium3" icon={<ShieldCheck className="h-4 w-4" />} accent="accent" subtitle="NIST FIPS 204" />
            <MetricCard label="Created" value={new Date(identity.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} icon={<Key className="h-4 w-4" />} accent="success" subtitle={new Date(identity.createdAt).getFullYear().toString()} />
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-primary" />
              Identity Details
            </h3>
            <div className="space-y-0">
              <DataRow label="Full Node ID" value={identity.nodeId} />
              <DataRow label="Network Status" value="DORMANT" />
              <DataRow label="Biometric Guard" value="Active (Windows Hello / Touch ID)" />
              <DataRow label="Key Storage" value="OS Keychain (hardware-backed)" />
              <DataRow label="Created At" value={new Date(identity.createdAt).toLocaleString()} />
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">Public Key</h3>
              <Button variant="outline" size="sm" onClick={handleCopy} className="h-7 text-xs font-mono border-border text-muted-foreground hover:text-foreground hover:bg-secondary">
                <Copy className="h-3 w-3 mr-1" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="glass-subtle rounded-lg p-3 font-mono text-xs text-primary break-all leading-relaxed">
              {identity.publicKey}
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <SectionHeader
          title="Post-Quantum Identity"
          description="Generate or import a Dilithium3 keypair"
        />

        {/* Idle — choose create or import */}
        {flow === "idle" && (
          <div className="flex flex-col items-center justify-center py-12 animate-enter">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Fingerprint className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">No Identity Found</h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-8">
              Create a new post-quantum identity or restore an existing one from your recovery phrase.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Button onClick={handleGenerate} className="flex-1 font-mono bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
              <Button onClick={() => setFlow("import")} variant="outline" className="flex-1 font-mono border-border text-foreground hover:bg-secondary" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Import Existing
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 font-mono">NIST FIPS 204 · Dilithium3 · Hardware-backed</p>
          </div>
        )}

        {/* Generating */}
        {flow === "generating" && (
          <div className="flex flex-col items-center justify-center py-16 animate-enter space-y-8">
            <AgentOrb active size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-foreground">Generating Keypair</h2>
              <p className="text-sm text-muted-foreground font-mono">Dilithium3 (NIST FIPS 204)</p>
            </div>
            <div className="space-y-3 w-full max-w-xs">
              {["Collecting entropy", "Deriving lattice parameters", "Generating keypair"].map((label, i) => (
                <div key={label} className="flex items-center gap-3 text-xs font-mono animate-fade-in" style={{ animationDelay: `${i * 800}ms`, animationFillMode: "backwards" }}>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                  <span className="text-primary">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display seed phrase */}
        {flow === "display" && (
          <div className="animate-enter space-y-6 max-w-lg mx-auto">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center glow-warning">
                  <Key className="h-6 w-6 text-warning" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-foreground">Recovery Seed Phrase</h2>
              <p className="text-sm text-muted-foreground">
                Write these 12 words down on paper. This is the <span className="text-warning font-medium">only way</span> to recover your identity.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SEED_PHRASE.map((word, i) => (
                <div key={i} className="bg-card rounded-lg border border-warning/20 p-3 text-center animate-fade-in" style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}>
                  <span className="text-[10px] font-mono text-muted-foreground block mb-0.5">{i + 1}</span>
                  <span className="text-sm font-mono font-bold text-warning">{word}</span>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-lg border border-destructive/20 p-4 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-bold text-destructive">This phrase is shown once and never stored.</p>
                <p>Losing it means permanent loss of your identity. There is no reset.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-card rounded-lg border border-border p-4">
              <Checkbox id="ack" checked={acknowledged} onCheckedChange={(c) => setAcknowledged(c === true)} />
              <label htmlFor="ack" className="text-sm text-foreground cursor-pointer select-none">
                I have written all 12 words in order
              </label>
            </div>

            <Button className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90" disabled={!acknowledged} onClick={() => setFlow("verify")}>
              Continue to Verification
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Verify */}
        {flow === "verify" && (
          <div className="animate-enter space-y-6 max-w-lg mx-auto">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-primary">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-foreground">Verify Your Backup</h2>
              <p className="text-sm text-muted-foreground">
                Enter words{" "}
                {verifyIndices.map((n, i) => (
                  <span key={n}>
                    <span className="font-mono text-primary">#{n}</span>
                    {i < verifyIndices.length - 1 && (i === verifyIndices.length - 2 ? ", and " : ", ")}
                  </span>
                ))}
              </p>
            </div>

            <div className="space-y-3">
              {verifyIndices.map((num, i) => (
                <div key={num} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Word #{num}</label>
                  <Input
                    value={verifyWords[i]}
                    onChange={(e) => {
                      const updated = [...verifyWords];
                      updated[i] = e.target.value;
                      setVerifyWords(updated);
                      setVerifyError(false);
                    }}
                    placeholder={`Enter word ${num}`}
                    className="font-mono bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                  />
                </div>
              ))}
            </div>

            {verifyError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-destructive font-mono">Incorrect. Check your written copy and try again.</span>
              </div>
            )}

            <Button className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90" disabled={verifyWords.some((w) => !w.trim())} onClick={handleVerify}>
              Verify & Create Identity
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Import flow */}
        {flow === "import" && (
          <div className="animate-enter space-y-6 max-w-lg mx-auto">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
                  <Download className="h-6 w-6 text-accent" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-foreground">Import Identity</h2>
              <p className="text-sm text-muted-foreground">
                Enter your 12-word recovery seed phrase to restore an existing identity.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {importWords.map((word, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}>
                  <label className="text-[10px] font-mono text-muted-foreground mb-1 block text-center">{i + 1}</label>
                  <Input
                    value={word}
                    onChange={(e) => {
                      const updated = [...importWords];
                      updated[i] = e.target.value.toLowerCase().replace(/[^a-z]/g, "");
                      setImportWords(updated);
                      setImportError("");
                    }}
                    className="font-mono text-sm text-center bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent h-10 px-1"
                    placeholder="····"
                  />
                </div>
              ))}
            </div>

            {importError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-destructive font-mono">{importError}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 font-mono border-border text-muted-foreground hover:text-foreground" onClick={() => { setFlow("idle"); setImportWords(Array(12).fill("")); setImportError(""); }}>
                Back
              </Button>
              <Button className="flex-1 font-mono bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleImport}>
                Restore Identity
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Import verifying */}
        {flow === "import-verifying" && (
          <div className="flex flex-col items-center justify-center py-16 animate-enter space-y-8">
            <AgentOrb active size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-foreground">Restoring Identity</h2>
              <p className="text-sm text-muted-foreground font-mono">Deriving keypair from mnemonic...</p>
            </div>
          </div>
        )}

        {/* Complete */}
        {flow === "complete" && (
          <div className="animate-enter text-center py-12 space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center glow-success animate-float">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">Identity Ready</h2>
              <p className="text-sm text-muted-foreground">Your keypair is stored in the OS keychain with biometric protection.</p>
            </div>
            <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setFlow("idle")}>
              View Identity Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default IdentityPage;
