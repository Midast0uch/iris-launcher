import { useState } from "react";
import { Fingerprint, Key, Radio, ShieldCheck, Copy, AlertTriangle, CheckCircle, Plus, ArrowRight, Download } from "lucide-react";
import { SectionHeader, DataRow, StatusBadge, MetricCard } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { AgentOrb } from "@/components/dashboard/AgentOrb";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { useCallback } from "react";

const SEED_PHRASE = ["quantum","shield","orbit","lattice","cipher","nexus","vector","prism","forge","pulse","drift","anchor"];

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

  const verifyIndices = [3, 8, 12];

  const handleGenerate = useCallback(() => {
    setFlow("generating");
    setTimeout(() => setFlow("display"), 2800);
  }, []);

  const handleVerify = () => {
    const correct = verifyWords[0].toLowerCase().trim() === SEED_PHRASE[2] && verifyWords[1].toLowerCase().trim() === SEED_PHRASE[7] && verifyWords[2].toLowerCase().trim() === SEED_PHRASE[11];
    if (correct) { setVerifyError(false); setIdentity(generateMockIdentity()); setFlow("complete"); }
    else { setVerifyError(true); }
  };

  const handleImport = () => {
    if (!importWords.every((w) => w.trim().length > 0)) { setImportError("Please fill in all 12 words."); return; }
    setImportError(""); setFlow("import-verifying");
    setTimeout(() => { setIdentity(generateMockIdentity()); setFlow("complete"); }, 2000);
  };

  const handleCopy = () => {
    if (identity) { navigator.clipboard.writeText(identity.publicKey); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  if (identity && flow !== "complete") {
    return (
      <PageTransition variant="scale">
        <div className="space-y-8">
          <SectionHeader title="Post-Quantum Identity" description="Dilithium3 keypair with biometric protection via OS keychain" />
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="online" label="IDENTITY ACTIVE" />
            <StatusBadge status="online" label="BIOMETRIC ON" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard label="Node ID" value={identity.nodeId.slice(0, 8)} icon={<Radio className="h-4 w-4" />} accent="primary" subtitle="Truncated — full 16 chars" />
            <MetricCard label="Algorithm" value="Dilithium3" icon={<ShieldCheck className="h-4 w-4" />} accent="accent" subtitle="NIST FIPS 204" />
            <MetricCard label="Created" value={new Date(identity.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} icon={<Key className="h-4 w-4" />} accent="success" subtitle={new Date(identity.createdAt).getFullYear().toString()} />
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-3">
              <LiquidIcon color="primary" size="sm"><Fingerprint className="h-4 w-4" /></LiquidIcon>
              Identity Details
            </h3>
            <DataRow label="Full Node ID" value={identity.nodeId} />
            <DataRow label="Network Status" value="DORMANT" />
            <DataRow label="Biometric Guard" value="Active (Windows Hello / Touch ID)" />
            <DataRow label="Key Storage" value="OS Keychain (hardware-backed)" />
            <DataRow label="Created At" value={new Date(identity.createdAt).toLocaleString()} />
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Public Key</h3>
              <Button variant="outline" size="sm" onClick={handleCopy} className="h-7 text-xs font-mono">
                <Copy className="h-3 w-3 mr-1" />{copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="glass-subtle rounded-xl p-3 font-mono text-xs text-primary break-all leading-relaxed">{identity.publicKey}</div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <SectionHeader title="Post-Quantum Identity" description="Generate or import a Dilithium3 keypair" />

        {flow === "idle" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center justify-center py-12">
            <LiquidIcon color="primary" size="xl" bounce className="mb-6">
              <Fingerprint className="h-10 w-10" />
            </LiquidIcon>
            <h2 className="text-lg font-semibold text-foreground mb-2">No Identity Found</h2>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-8 tracking-wide">Create a new post-quantum identity or restore an existing one from your recovery phrase.</p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
              <Button onClick={handleGenerate} className="flex-1 font-mono bg-primary text-primary-foreground hover:bg-primary/90" size="lg"><Plus className="h-4 w-4 mr-2" />Create New</Button>
              <Button onClick={() => setFlow("import")} variant="outline" className="flex-1 font-mono" size="lg"><Download className="h-4 w-4 mr-2" />Import Existing</Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-4 font-mono tracking-wider">NIST FIPS 204 · Dilithium3 · Hardware-backed</p>
          </motion.div>
        )}

        {flow === "generating" && (
          <div className="flex flex-col items-center justify-center py-16 animate-enter space-y-8">
            <AgentOrb active size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Generating Keypair</h2>
              <p className="text-sm text-muted-foreground font-mono">Dilithium3 (NIST FIPS 204)</p>
            </div>
            <div className="space-y-3 w-full max-w-xs">
              {["Collecting entropy", "Deriving lattice parameters", "Generating keypair"].map((label, i) => (
                <motion.div key={label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.7, type: "spring" as const, stiffness: 300, damping: 25 }} className="flex items-center gap-3 text-xs font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                  <span className="text-primary">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {flow === "display" && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 max-w-lg mx-auto">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <LiquidIcon color="warning" size="lg" bounce><Key className="h-6 w-6" /></LiquidIcon>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Recovery Seed Phrase</h2>
              <p className="text-sm text-muted-foreground tracking-wide">Write these 12 words down on paper. This is the <span className="text-warning font-medium">only way</span> to recover your identity.</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {SEED_PHRASE.map((word, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05, type: "spring" as const, stiffness: 400, damping: 20 }} className="glass-card rounded-xl p-3 text-center">
                  <span className="text-[10px] font-mono text-muted-foreground block mb-0.5">{i + 1}</span>
                  <span className="text-sm font-mono font-bold text-warning">{word}</span>
                </motion.div>
              ))}
            </div>
            <div className="glass-card rounded-xl p-4 flex items-start gap-3 border-destructive/20">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-destructive">This phrase is shown once and never stored.</p>
                <p>Losing it means permanent loss of your identity. There is no reset.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 glass-card rounded-xl p-4">
              <Checkbox id="ack" checked={acknowledged} onCheckedChange={(c) => setAcknowledged(c === true)} />
              <label htmlFor="ack" className="text-sm text-foreground cursor-pointer select-none">I have written all 12 words in order</label>
            </div>
            <Button className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90" disabled={!acknowledged} onClick={() => setFlow("verify")}>Continue to Verification<ArrowRight className="ml-2 h-4 w-4" /></Button>
          </motion.div>
        )}

        {flow === "verify" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 max-w-lg mx-auto">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4"><LiquidIcon color="primary" size="lg" bounce><ShieldCheck className="h-6 w-6" /></LiquidIcon></div>
              <h2 className="text-lg font-semibold text-foreground">Verify Your Backup</h2>
              <p className="text-sm text-muted-foreground">Enter words {verifyIndices.map((n, i) => (<span key={n}><span className="font-mono text-primary">#{n}</span>{i < verifyIndices.length - 1 && (i === verifyIndices.length - 2 ? ", and " : ", ")}</span>))}</p>
            </div>
            <div className="space-y-3">
              {verifyIndices.map((num, i) => (
                <motion.div key={num} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, type: "spring" as const, stiffness: 300, damping: 25 }}>
                  <label className="text-xs font-mono text-muted-foreground mb-1.5 block">Word #{num}</label>
                  <Input value={verifyWords[i]} onChange={(e) => { const u = [...verifyWords]; u[i] = e.target.value; setVerifyWords(u); setVerifyError(false); }} placeholder={`Enter word ${num}`} className="font-mono glass-subtle border-0 text-foreground placeholder:text-muted-foreground" />
                </motion.div>
              ))}
            </div>
            {verifyError && <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-xs text-destructive font-mono">Incorrect. Check your written copy and try again.</span></div>}
            <Button className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90" disabled={verifyWords.some((w) => !w.trim())} onClick={handleVerify}>Verify & Create Identity<CheckCircle className="ml-2 h-4 w-4" /></Button>
          </motion.div>
        )}

        {flow === "import" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="space-y-6 max-w-lg mx-auto">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4"><LiquidIcon color="accent" size="lg" bounce><Download className="h-6 w-6" /></LiquidIcon></div>
              <h2 className="text-lg font-semibold text-foreground">Import Identity</h2>
              <p className="text-sm text-muted-foreground tracking-wide">Enter your 12-word recovery seed phrase to restore an existing identity.</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {importWords.map((word, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03, type: "spring" as const, stiffness: 400, damping: 20 }}>
                  <label className="text-[10px] font-mono text-muted-foreground mb-1 block text-center">{i + 1}</label>
                  <Input value={word} onChange={(e) => { const u = [...importWords]; u[i] = e.target.value.toLowerCase().replace(/[^a-z]/g, ""); setImportWords(u); setImportError(""); }} className="font-mono text-sm text-center glass-subtle border-0 text-foreground placeholder:text-muted-foreground h-10 px-1" placeholder="····" />
                </motion.div>
              ))}
            </div>
            {importError && <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-xs text-destructive font-mono">{importError}</span></div>}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 font-mono" onClick={() => { setFlow("idle"); setImportWords(Array(12).fill("")); setImportError(""); }}>Back</Button>
              <Button className="flex-1 font-mono bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleImport}>Restore Identity<ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </motion.div>
        )}

        {flow === "import-verifying" && (
          <div className="flex flex-col items-center justify-center py-16 animate-enter space-y-8">
            <AgentOrb active size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Restoring Identity</h2>
              <p className="text-sm text-muted-foreground font-mono">Deriving keypair from mnemonic...</p>
            </div>
          </div>
        )}

        {flow === "complete" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" as const, stiffness: 300, damping: 20 }} className="text-center py-12 space-y-6">
            <div className="flex justify-center">
              <LiquidIcon color="success" size="xl" bounce><CheckCircle className="h-8 w-8" /></LiquidIcon>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Identity Ready</h2>
              <p className="text-sm text-muted-foreground tracking-wide">Your keypair is stored in the OS keychain with biometric protection.</p>
            </div>
            <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setFlow("idle")}>View Identity Details<ArrowRight className="ml-2 h-4 w-4" /></Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default IdentityPage;
