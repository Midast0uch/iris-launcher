import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Github, Link, Unlink, GitBranch, Lock, Globe, CheckCircle, ArrowRight, ExternalLink, RefreshCw, KeyRound, Copy, Trash2, Plus, ShieldCheck } from "lucide-react";
import { SectionHeader, StatusBadge, DataRow } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { AgentOrb } from "@/components/dashboard/AgentOrb";
import { motion } from "framer-motion";

interface GitHubConnection {
  username: string;
  repo: string;
  branch: string;
  visibility: "public" | "private";
  connectedAt: string;
  avatarUrl: string;
}

interface SSHKey {
  id: string;
  name: string;
  fingerprint: string;
  type: "ed25519" | "rsa";
  createdAt: string;
  lastUsed?: string;
}

type ConnectStep = "idle" | "authenticating" | "select-repo" | "connected";
type SSHStep = "list" | "generating" | "display";

const mockRepos = [
  { name: "iris-source", visibility: "private" as const, defaultBranch: "main", updatedAt: "2h ago" },
  { name: "iris-skills", visibility: "private" as const, defaultBranch: "main", updatedAt: "1d ago" },
  { name: "iris-config", visibility: "public" as const, defaultBranch: "main", updatedAt: "3d ago" },
  { name: "dotfiles", visibility: "private" as const, defaultBranch: "master", updatedAt: "1w ago" },
];

function generateMockFingerprint() {
  const parts = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0"));
  return `SHA256:${btoa(parts.join("")).slice(0, 43)}`;
}

function generateMockPublicKey(type: "ed25519" | "rsa") {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const len = type === "ed25519" ? 68 : 372;
  const body = Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `ssh-${type} ${body} iris@launcher`;
}

const GitHubPage = () => {
  const { setGitHubConnected } = useApp();
  const [step, setStep] = useState<ConnectStep>("idle");
  const [connection, setConnection] = useState<GitHubConnection | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");

  const [sshKeys, setSSHKeys] = useState<SSHKey[]>([]);
  const [sshStep, setSSHStep] = useState<SSHStep>("list");
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState<"ed25519" | "rsa">("ed25519");
  const [generatedPubKey, setGeneratedPubKey] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleAuth = () => {
    if (!tokenInput.trim()) return;
    setStep("authenticating");
    setTimeout(() => setStep("select-repo"), 2000);
  };

  const handleSelectRepo = (repoName: string) => setSelectedRepo(repoName);

  const handleConnect = () => {
    if (!selectedRepo) return;
    const repo = mockRepos.find((r) => r.name === selectedRepo)!;
    setConnection({
      username: "iris-user",
      repo: selectedRepo,
      branch: repo.defaultBranch,
      visibility: repo.visibility,
      connectedAt: new Date().toISOString(),
      avatarUrl: "",
    });
    setStep("connected");
    setGitHubConnected(true);
  };

  const handleDisconnect = () => {
    setConnection(null);
    setSelectedRepo(null);
    setTokenInput("");
    setStep("idle");
    setGitHubConnected(false);
  };

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    setSSHStep("generating");
    const pubKey = generateMockPublicKey(newKeyType);
    setTimeout(() => {
      const newKey: SSHKey = {
        id: crypto.randomUUID(),
        name: newKeyName.trim(),
        fingerprint: generateMockFingerprint(),
        type: newKeyType,
        createdAt: new Date().toISOString(),
      };
      setSSHKeys((prev) => [...prev, newKey]);
      setGeneratedPubKey(pubKey);
      setSSHStep("display");
    }, 1800);
  };

  const handleDeleteKey = (id: string) => setSSHKeys((prev) => prev.filter((k) => k.id !== id));

  const handleCopyKey = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDoneWithKey = () => {
    setSSHStep("list");
    setNewKeyName("");
    setGeneratedPubKey("");
  };

  return (
    <PageTransition variant="slide-left">
      <div className="space-y-8">
        <SectionHeader
          title="GitHub Connection"
          description="Link a repository to enable Git source control and diff review"
          action={
            connection ? (
              <Button variant="outline" size="sm" onClick={handleDisconnect} className="font-mono text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
                <Unlink className="h-3.5 w-3.5 mr-1.5" />
                Disconnect
              </Button>
            ) : undefined
          }
        />

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={connection ? "online" : "offline"} label={connection ? "GITHUB CONNECTED" : "NOT CONNECTED"} />
          {connection && (
            <>
              <StatusBadge status="online" label={`REPO: ${connection.repo.toUpperCase()}`} />
              <StatusBadge status={connection.visibility === "private" ? "dormant" : "warning"} label={connection.visibility.toUpperCase()} />
              {sshKeys.length > 0 && <StatusBadge status="online" label={`${sshKeys.length} SSH KEY${sshKeys.length > 1 ? "S" : ""}`} />}
            </>
          )}
        </div>

        {/* Idle */}
        {step === "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-lg mx-auto"
          >
            <div className="flex flex-col items-center justify-center py-8">
              <LiquidIcon color="neutral" size="xl" bounce className="mb-6">
                <Github className="h-10 w-10" />
              </LiquidIcon>
              <h2 className="text-lg font-semibold text-foreground mb-2">Connect to GitHub</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-8 tracking-wide">
                Link a GitHub repository to enable source tracking, commit history, and agent diff reviews.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-3">
                <LiquidIcon color="primary" size="sm"><Lock className="h-4 w-4" /></LiquidIcon>
                Personal Access Token
              </h3>
              <p className="text-xs text-muted-foreground tracking-wide">
                Generate a <span className="font-mono text-foreground">fine-grained</span> token from{" "}
                <span className="font-mono text-primary">GitHub → Settings → Tokens</span> with <span className="font-mono text-foreground">repo</span> scope.
              </p>
              <Input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="font-mono glass-subtle border-0 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
              <Button className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90" disabled={!tokenInput.trim()} onClick={handleAuth}>
                <Link className="h-4 w-4 mr-2" />
                Authenticate
              </Button>
            </div>
          </motion.div>
        )}

        {/* Authenticating */}
        {step === "authenticating" && (
          <div className="flex flex-col items-center justify-center py-16 animate-enter space-y-8">
            <AgentOrb active size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Authenticating</h2>
              <p className="text-sm text-muted-foreground font-mono">Verifying token with GitHub API...</p>
            </div>
            <div className="space-y-3 w-full max-w-xs">
              {["Validating token", "Fetching repositories", "Checking permissions"].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.5, type: "spring" as const, stiffness: 300, damping: 25 }}
                  className="flex items-center gap-3 text-xs font-mono"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                  <span className="text-primary">{label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Select repo */}
        {step === "select-repo" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 max-w-lg mx-auto"
          >
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <LiquidIcon color="success" size="lg" bounce>
                  <CheckCircle className="h-6 w-6" />
                </LiquidIcon>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Authenticated as @iris-user</h2>
              <p className="text-sm text-muted-foreground tracking-wide">Select a repository to link with IRIS.</p>
            </div>

            <div className="glass-card rounded-2xl divide-y divide-border overflow-hidden">
              {mockRepos.map((repo, i) => (
                <motion.button
                  key={repo.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, type: "spring" as const, stiffness: 300, damping: 25 }}
                  onClick={() => handleSelectRepo(repo.name)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-muted/30 ${
                    selectedRepo === repo.name ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                      selectedRepo === repo.name ? "liquid-icon liquid-icon-primary" : "glass-subtle"
                    }`}>
                      <Github className={`h-4 w-4 ${selectedRepo === repo.name ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono font-medium text-foreground">{repo.name}</p>
                        {repo.visibility === "private" ? <Lock className="h-3 w-3 text-muted-foreground" /> : <Globe className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground">{repo.defaultBranch} · updated {repo.updatedAt}</p>
                    </div>
                  </div>
                  {selectedRepo === repo.name && <CheckCircle className="h-4 w-4 text-primary" />}
                </motion.button>
              ))}
            </div>

            <Button className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90" disabled={!selectedRepo} onClick={handleConnect}>
              Connect Repository
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* Connected */}
        {step === "connected" && connection && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-3">
                <LiquidIcon color="neutral" size="sm"><Github className="h-4 w-4" /></LiquidIcon>
                Repository Details
              </h3>
              <div className="space-y-0">
                <DataRow label="Account" value={`@${connection.username}`} />
                <DataRow label="Repository" value={connection.repo} />
                <DataRow label="Default Branch" value={connection.branch} />
                <DataRow label="Visibility" value={connection.visibility === "private" ? "Private" : "Public"} />
                <DataRow label="Connected At" value={new Date(connection.connectedAt).toLocaleString()} />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-3">
                <LiquidIcon color="primary" size="sm"><GitBranch className="h-4 w-4" /></LiquidIcon>
                What's Enabled
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Git & Source Control", desc: "View commit history, branch status, and uncommitted changes" },
                  { label: "Diff Review", desc: "Review and approve/reject agent-proposed code changes before commit" },
                  { label: "Auto-commit", desc: "Agent writes are automatically committed with descriptive messages" },
                  { label: "Rollback", desc: "Revert to any previous verified-good commit instantly" },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, type: "spring" as const, stiffness: 300, damping: 25 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-mono text-foreground">{feature.label}</p>
                      <p className="text-[10px] text-muted-foreground tracking-wide">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SSH Key Management */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-3">
                  <LiquidIcon color="accent" size="sm"><KeyRound className="h-4 w-4" /></LiquidIcon>
                  SSH Keys
                </h3>
                {sshStep === "list" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setSSHStep("display"); setGeneratedPubKey(""); }}
                    className="h-7 text-xs font-mono border-accent/30 text-accent hover:bg-accent/10"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Generate Key
                  </Button>
                )}
              </div>

              {sshStep === "list" && (
                <>
                  {sshKeys.length === 0 ? (
                    <div className="text-center py-8">
                      <LiquidIcon color="neutral" size="lg" bounce={false} className="mx-auto mb-3 opacity-40">
                        <KeyRound className="h-6 w-6" />
                      </LiquidIcon>
                      <p className="text-sm text-muted-foreground">No SSH keys configured</p>
                      <p className="text-[10px] text-muted-foreground mt-1 tracking-wide">Generate a key for secure Git operations over SSH</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sshKeys.map((key) => (
                        <motion.div
                          key={key.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                          className="glass-subtle rounded-xl p-3 flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <LiquidIcon color="accent" size="sm" bounce={false}>
                              <KeyRound className="h-4 w-4" />
                            </LiquidIcon>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-mono font-medium text-foreground">{key.name}</p>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md glass-subtle text-muted-foreground">{key.type.toUpperCase()}</span>
                              </div>
                              <p className="text-[10px] font-mono text-muted-foreground">{key.fingerprint}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopyKey(key.fingerprint, key.id)}>
                              {copiedKey === key.id ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteKey(key.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {sshStep === "generating" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                  <AgentOrb active size="md" />
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-foreground">Generating {newKeyType.toUpperCase()} Key</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Collecting entropy and deriving key pair...</p>
                  </div>
                </div>
              )}

              {sshStep === "display" && !generatedPubKey && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block tracking-wide">Key Name</label>
                    <Input
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g. iris-laptop"
                      className="font-mono glass-subtle border-0 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block tracking-wide">Key Type</label>
                    <div className="flex gap-2">
                      {(["ed25519", "rsa"] as const).map((type) => (
                        <motion.button
                          key={type}
                          onClick={() => setNewKeyType(type)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-mono transition-all ${
                            newKeyType === type ? "liquid-icon liquid-icon-accent text-accent" : "glass-subtle text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {type.toUpperCase()}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 font-mono text-xs" onClick={handleDoneWithKey}>Cancel</Button>
                    <Button className="flex-1 font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleGenerateKey} disabled={!newKeyName.trim()}>
                      <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                      Generate
                    </Button>
                  </div>
                </div>
              )}

              {sshStep === "display" && generatedPubKey && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <LiquidIcon color="success" size="sm" bounce>
                      <CheckCircle className="h-4 w-4" />
                    </LiquidIcon>
                    <p className="text-sm font-semibold text-foreground">Key Generated Successfully</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-muted-foreground tracking-wide">Public Key</label>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] font-mono text-muted-foreground hover:text-foreground" onClick={() => handleCopyKey(generatedPubKey, "new")}>
                        {copiedKey === "new" ? <><CheckCircle className="h-3 w-3 mr-1 text-success" />Copied</> : <><Copy className="h-3 w-3 mr-1" />Copy</>}
                      </Button>
                    </div>
                    <div className="glass-subtle rounded-xl p-3 font-mono text-[10px] text-primary break-all leading-relaxed">{generatedPubKey}</div>
                  </div>
                  <p className="text-[10px] text-muted-foreground tracking-wide">Add this public key to your GitHub account under <span className="font-mono text-foreground">Settings → SSH Keys</span>.</p>
                  <Button className="w-full font-mono text-xs" onClick={handleDoneWithKey}>Done</Button>
                </motion.div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <LiquidIcon color="warning" size="sm" bounce={false}>
                  <ExternalLink className="h-4 w-4" />
                </LiquidIcon>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground text-sm">Quick Links</p>
                  <p>Manage your GitHub settings, SSH keys, and access tokens directly on GitHub.</p>
                  <div className="flex gap-3 mt-2">
                    <a href="#" className="text-primary hover:underline font-mono">Repository Settings</a>
                    <a href="#" className="text-primary hover:underline font-mono">Deploy Keys</a>
                    <a href="#" className="text-primary hover:underline font-mono">Webhooks</a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default GitHubPage;
