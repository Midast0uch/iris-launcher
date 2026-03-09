import { useState } from "react";
import { Github, Link, Unlink, GitBranch, Lock, Globe, CheckCircle, ArrowRight, ExternalLink, RefreshCw, KeyRound, Copy, Trash2, Plus, ShieldCheck } from "lucide-react";
import { SectionHeader, StatusBadge, DataRow } from "@/components/dashboard/DashboardPrimitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { AgentOrb } from "@/components/dashboard/AgentOrb";

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
  const [step, setStep] = useState<ConnectStep>("idle");
  const [connection, setConnection] = useState<GitHubConnection | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");

  // SSH key state
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

  const handleSelectRepo = (repoName: string) => {
    setSelectedRepo(repoName);
  };

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
  };

  const handleDisconnect = () => {
    setConnection(null);
    setSelectedRepo(null);
    setTokenInput("");
    setStep("idle");
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

  const handleDeleteKey = (id: string) => {
    setSSHKeys((prev) => prev.filter((k) => k.id !== id));
  };

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
    <PageTransition>
      <div className="space-y-8">
        <SectionHeader
          title="GitHub Connection"
          description="Link a repository to enable Git source control and diff review"
          action={
            connection ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="font-mono text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Unlink className="h-3.5 w-3.5 mr-1.5" />
                Disconnect
              </Button>
            ) : undefined
          }
        />

        <div className="flex flex-wrap gap-2">
          <StatusBadge
            status={connection ? "online" : "offline"}
            label={connection ? "GITHUB CONNECTED" : "NOT CONNECTED"}
          />
          {connection && (
            <>
              <StatusBadge status="online" label={`REPO: ${connection.repo.toUpperCase()}`} />
              <StatusBadge
                status={connection.visibility === "private" ? "dormant" : "warning"}
                label={connection.visibility.toUpperCase()}
              />
              {sshKeys.length > 0 && (
                <StatusBadge status="online" label={`${sshKeys.length} SSH KEY${sshKeys.length > 1 ? "S" : ""}`} />
              )}
            </>
          )}
        </div>

        {/* Idle — prompt to connect */}
        {step === "idle" && (
          <div className="animate-enter space-y-6 max-w-lg mx-auto">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-20 w-20 rounded-2xl bg-foreground/5 border border-[hsl(0_0%_100%/0.08)] flex items-center justify-center mb-6">
                <Github className="h-10 w-10 text-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">Connect to GitHub</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-8">
                Link a GitHub repository to enable source tracking, commit history, and agent diff reviews.
              </p>
            </div>

            <div className="glass rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Personal Access Token
              </h3>
              <p className="text-xs text-muted-foreground">
                Generate a <span className="font-mono text-foreground">fine-grained</span> personal access token from{" "}
                <span className="font-mono text-primary">GitHub → Settings → Developer Settings → Tokens</span> with <span className="font-mono text-foreground">repo</span> scope.
              </p>
              <Input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="font-mono glass-subtle border-0 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
              <Button
                className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!tokenInput.trim()}
                onClick={handleAuth}
              >
                <Link className="h-4 w-4 mr-2" />
                Authenticate
              </Button>
            </div>
          </div>
        )}

        {/* Authenticating */}
        {step === "authenticating" && (
          <div className="flex flex-col items-center justify-center py-16 animate-enter space-y-8">
            <AgentOrb active size="lg" />
            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-foreground">Authenticating</h2>
              <p className="text-sm text-muted-foreground font-mono">Verifying token with GitHub API...</p>
            </div>
            <div className="space-y-3 w-full max-w-xs">
              {["Validating token", "Fetching repositories", "Checking permissions"].map((label, i) => (
                <div
                  key={label}
                  className="flex items-center gap-3 text-xs font-mono animate-fade-in"
                  style={{ animationDelay: `${i * 600}ms`, animationFillMode: "backwards" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                  <span className="text-primary">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Select repo */}
        {step === "select-repo" && (
          <div className="animate-enter space-y-6 max-w-lg mx-auto">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-foreground">Authenticated as @iris-user</h2>
              <p className="text-sm text-muted-foreground">Select a repository to link with IRIS.</p>
            </div>

            <div className="glass rounded-xl divide-y divide-[hsl(0_0%_100%/0.05)] overflow-hidden">
              {mockRepos.map((repo) => (
                <button
                  key={repo.name}
                  onClick={() => handleSelectRepo(repo.name)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-[hsl(0_0%_100%/0.03)] ${
                    selectedRepo === repo.name ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      selectedRepo === repo.name
                        ? "bg-primary/15 border border-primary/30 text-primary"
                        : "glass-subtle text-muted-foreground"
                    }`}>
                      <Github className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono font-medium text-foreground">{repo.name}</p>
                        {repo.visibility === "private" ? (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Globe className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {repo.defaultBranch} · updated {repo.updatedAt}
                      </p>
                    </div>
                  </div>
                  {selectedRepo === repo.name && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>

            <Button
              className="w-full font-mono bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!selectedRepo}
              onClick={handleConnect}
            >
              Connect Repository
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Connected — show details + SSH */}
        {step === "connected" && connection && (
          <div className="animate-enter space-y-6">
            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <Github className="h-4 w-4 text-foreground" />
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

            <div className="glass rounded-xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                What's Enabled
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Git & Source Control", desc: "View commit history, branch status, and uncommitted changes" },
                  { label: "Diff Review", desc: "Review and approve/reject agent-proposed code changes before commit" },
                  { label: "Auto-commit", desc: "Agent writes are automatically committed with descriptive messages" },
                  { label: "Rollback", desc: "Revert to any previous verified-good commit instantly" },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-mono text-foreground">{feature.label}</p>
                      <p className="text-[10px] text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SSH Key Management */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-accent" />
                  SSH Keys
                </h3>
                {sshStep === "list" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSSHStep("display")}
                    className="h-7 text-xs font-mono border-accent/30 text-accent hover:bg-accent/10"
                    // Only show generate form
                    onClickCapture={(e) => {
                      e.stopPropagation();
                      setSSHStep("display");
                      setGeneratedPubKey("");
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Generate Key
                  </Button>
                )}
              </div>

              {/* Key list */}
              {sshStep === "list" && (
                <>
                  {sshKeys.length === 0 ? (
                    <div className="text-center py-8">
                      <KeyRound className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-40" />
                      <p className="text-sm text-muted-foreground">No SSH keys configured</p>
                      <p className="text-[10px] text-muted-foreground mt-1">Generate a key for secure Git operations over SSH</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sshKeys.map((key) => (
                        <div key={key.id} className="glass-subtle rounded-lg p-3 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                              <KeyRound className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-mono font-medium text-foreground">{key.name}</p>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md glass-subtle text-muted-foreground">
                                  {key.type.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-muted-foreground">{key.fingerprint}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleCopyKey(key.fingerprint, key.id)}
                            >
                              {copiedKey === key.id ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDeleteKey(key.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Generating animation */}
              {sshStep === "generating" && (
                <div className="flex flex-col items-center justify-center py-8 animate-enter space-y-6">
                  <AgentOrb active size="md" />
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-foreground">Generating {newKeyType.toUpperCase()} keypair</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Creating secure key for {newKeyName}...</p>
                  </div>
                </div>
              )}

              {/* Display generated key / generate form */}
              {sshStep === "display" && !generatedPubKey && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Key Name</label>
                      <Input
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g., iris-deploy, macbook-pro"
                        className="font-mono glass-subtle border-0 text-foreground placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Key Type</label>
                      <div className="flex gap-2">
                        {(["ed25519", "rsa"] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => setNewKeyType(type)}
                            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-mono text-center transition-all ${
                              newKeyType === type
                                ? "bg-accent/15 border border-accent/30 text-accent"
                                : "glass-subtle text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className="font-medium">{type.toUpperCase()}</span>
                            <span className="block text-[9px] mt-0.5 opacity-70">
                              {type === "ed25519" ? "Recommended · Fast" : "Legacy · Compatible"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 font-mono text-xs text-muted-foreground hover:text-foreground"
                      onClick={handleDoneWithKey}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={!newKeyName.trim()}
                      onClick={handleGenerateKey}
                    >
                      <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                      Generate
                    </Button>
                  </div>
                </div>
              )}

              {/* Show generated public key */}
              {sshStep === "display" && generatedPubKey && (
                <div className="space-y-4 animate-enter">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <p className="text-sm font-medium text-foreground">Key Generated — <span className="text-accent font-mono">{newKeyName}</span></p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs text-muted-foreground">Public Key</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[10px] font-mono text-muted-foreground hover:text-foreground"
                        onClick={() => handleCopyKey(generatedPubKey, "pubkey")}
                      >
                        {copiedKey === "pubkey" ? (
                          <><CheckCircle className="h-3 w-3 mr-1 text-success" /> Copied</>
                        ) : (
                          <><Copy className="h-3 w-3 mr-1" /> Copy</>
                        )}
                      </Button>
                    </div>
                    <div className="glass-subtle rounded-lg p-3 font-mono text-[11px] text-primary break-all leading-relaxed select-all">
                      {generatedPubKey}
                    </div>
                  </div>
                  <div className="glass-subtle rounded-lg p-3 flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    <p className="text-[10px] text-muted-foreground">
                      Add this public key to <span className="font-mono text-primary">GitHub → Settings → SSH and GPG Keys → New SSH Key</span>. The private key is stored securely in your OS keychain.
                    </p>
                  </div>
                  <Button
                    className="w-full font-mono text-xs bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleDoneWithKey}
                  >
                    Done
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 font-mono text-xs border-[hsl(0_0%_100%/0.08)] text-muted-foreground hover:text-foreground hover:bg-[hsl(0_0%_100%/0.04)]"
                onClick={() => window.open(`https://github.com/${connection.username}/${connection.repo}`, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Open on GitHub
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-mono text-xs border-[hsl(0_0%_100%/0.08)] text-muted-foreground hover:text-foreground hover:bg-[hsl(0_0%_100%/0.04)]"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Sync Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default GitHubPage;
