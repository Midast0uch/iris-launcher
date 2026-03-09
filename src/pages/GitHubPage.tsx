import { useState } from "react";
import { Github, Link, Unlink, GitBranch, Lock, Globe, CheckCircle, ArrowRight, ExternalLink, RefreshCw } from "lucide-react";
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

type ConnectStep = "idle" | "authenticating" | "select-repo" | "connected";

const mockRepos = [
  { name: "iris-source", visibility: "private" as const, defaultBranch: "main", updatedAt: "2h ago" },
  { name: "iris-skills", visibility: "private" as const, defaultBranch: "main", updatedAt: "1d ago" },
  { name: "iris-config", visibility: "public" as const, defaultBranch: "main", updatedAt: "3d ago" },
  { name: "dotfiles", visibility: "private" as const, defaultBranch: "master", updatedAt: "1w ago" },
];

const GitHubPage = () => {
  const [step, setStep] = useState<ConnectStep>("idle");
  const [connection, setConnection] = useState<GitHubConnection | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");

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
            </>
          )}
        </div>

        {/* Idle — prompt to connect */}
        {step === "idle" && (
          <div className="animate-enter space-y-6 max-w-lg mx-auto">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-20 w-20 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center mb-6">
                <Github className="h-10 w-10 text-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">Connect to GitHub</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-8">
                Link a GitHub repository to enable source tracking, commit history, and agent diff reviews.
              </p>
            </div>

            <div className="bg-card rounded-lg border border-border p-5 space-y-4">
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
                className="font-mono bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
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

            <div className="bg-card rounded-lg border border-border divide-y divide-border">
              {mockRepos.map((repo) => (
                <button
                  key={repo.name}
                  onClick={() => handleSelectRepo(repo.name)}
                  className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-secondary/30 ${
                    selectedRepo === repo.name ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                      selectedRepo === repo.name
                        ? "bg-primary/15 border border-primary/30 text-primary"
                        : "bg-secondary border border-border text-muted-foreground"
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

        {/* Connected — show details */}
        {step === "connected" && connection && (
          <div className="animate-enter space-y-6">
            <div className="bg-card rounded-lg border border-border p-5">
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

            <div className="bg-card rounded-lg border border-border p-5">
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

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 font-mono text-xs border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                onClick={() => window.open(`https://github.com/${connection.username}/${connection.repo}`, "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                Open on GitHub
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-mono text-xs border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
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
