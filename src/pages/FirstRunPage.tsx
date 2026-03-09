import { useState, useCallback } from "react";
import { Shield, Key, CheckCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AgentOrb } from "@/components/dashboard/AgentOrb";

const SEED_PHRASE = [
  "quantum", "shield", "orbit", "lattice",
  "cipher", "nexus", "vector", "prism",
  "forge", "pulse", "drift", "anchor",
];

type Step = "generating" | "display" | "verify" | "complete";

const FirstRunPage = () => {
  const [step, setStep] = useState<Step>("generating");
  const [acknowledged, setAcknowledged] = useState(false);
  const [verifyWords, setVerifyWords] = useState(["", "", ""]);
  const [verifyError, setVerifyError] = useState(false);

  // Simulate generation
  const startGeneration = useCallback(() => {
    setStep("generating");
    setTimeout(() => setStep("display"), 2500);
  }, []);

  // Auto-trigger generation on mount
  useState(() => {
    setTimeout(() => setStep("display"), 2500);
  });

  const handleVerify = () => {
    const correct =
      verifyWords[0].toLowerCase().trim() === SEED_PHRASE[9] &&
      verifyWords[1].toLowerCase().trim() === SEED_PHRASE[10] &&
      verifyWords[2].toLowerCase().trim() === SEED_PHRASE[11];

    if (correct) {
      setVerifyError(false);
      setStep("complete");
    } else {
      setVerifyError(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Generating step */}
        {step === "generating" && (
          <div className="animate-enter text-center space-y-8">
            <div className="flex justify-center">
              <AgentOrb active size="lg" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">Generating Post-Quantum Identity</h1>
              <p className="text-sm text-muted-foreground font-mono">Dilithium3 keypair (NIST FIPS 204)</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-primary">
              <span className="animate-pulse-glow">●</span>
              <span>Generating entropy...</span>
            </div>
          </div>
        )}

        {/* Display seed phrase */}
        {step === "display" && (
          <div className="animate-enter space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-xl bg-warning/15 border border-warning/30 flex items-center justify-center glow-warning">
                  <Key className="h-6 w-6 text-warning" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-foreground">Recovery Seed Phrase</h1>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Write these 12 words down on paper and store them somewhere safe. This is the <span className="text-warning font-medium">only way</span> to recover your identity if this device is lost.
              </p>
            </div>

            {/* Seed phrase grid */}
            <div className="grid grid-cols-3 gap-2">
              {SEED_PHRASE.map((word, i) => (
                <div
                  key={i}
                  className="glass rounded-xl border-warning/20 p-3 text-center animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
                >
                  <span className="text-[10px] font-mono text-muted-foreground block mb-0.5">{i + 1}</span>
                  <span className="text-sm font-mono font-bold text-warning">{word}</span>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div className="glass rounded-xl border-destructive/20 p-4 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-bold text-destructive">This phrase is shown once and never stored.</p>
                <p>If you lose it and lose access to this device, your identity is permanently unrecoverable. There is no reset mechanism.</p>
              </div>
            </div>

            {/* Acknowledgment */}
            <div className="flex items-center gap-3 glass rounded-xl p-4">
              <Checkbox
                id="ack"
                checked={acknowledged}
                onCheckedChange={(c) => setAcknowledged(c === true)}
              />
              <label htmlFor="ack" className="text-sm text-foreground cursor-pointer select-none">
                I have written all 12 words in order
              </label>
            </div>

            <Button
              className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!acknowledged}
              onClick={() => setStep("verify")}
            >
              Continue to Verification
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Verify step */}
        {step === "verify" && (
          <div className="animate-enter space-y-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-primary">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-foreground">Confirm Your Seed Phrase</h1>
              <p className="text-sm text-muted-foreground">
                Type words <span className="font-mono text-primary">10</span>, <span className="font-mono text-primary">11</span>, and <span className="font-mono text-primary">12</span> to verify you wrote them down.
              </p>
            </div>

            <div className="space-y-3">
              {[10, 11, 12].map((num, i) => (
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
                    className="font-mono glass-subtle border-0 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                  />
                </div>
              ))}
            </div>

            {verifyError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-destructive font-mono">Words do not match. Check your written copy and try again.</span>
              </div>
            )}

            <Button
              className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={verifyWords.some((w) => !w.trim())}
              onClick={handleVerify}
            >
              Verify & Complete Setup
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Complete */}
        {step === "complete" && (
          <div className="animate-enter text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center glow-success animate-float">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">Identity Created</h1>
              <p className="text-sm text-muted-foreground">
                Your Dilithium3 keypair is stored in the OS keychain with biometric protection.
              </p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 space-y-2 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-mono">NODE ID</span>
                <span className="font-mono text-primary">a3f9d2c1e8b74f6d</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground font-mono">ALGORITHM</span>
                <span className="font-mono text-accent">Dilithium3</span>
              </div>
            </div>
            <Button
              className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => window.location.href = "/"}
            >
              Enter IRIS Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstRunPage;
