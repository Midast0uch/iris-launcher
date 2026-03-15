import { HardDrive, Plus, FolderOpen, Shield, Rocket, CheckCircle, Wifi, WifiOff } from "lucide-react";
import { SectionHeader, StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { AgentOrb } from "@/components/dashboard/AgentOrb";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects, useBackendOnline } from "@/hooks/use-iris-backend";
import { irisApi, IRISProject } from "@/lib/iris-api";

type LaunchState = "idle" | "launching" | "running";

const ProjectsPage = () => {
  const { data: online } = useBackendOnline();
  const { data: projectsData } = useProjects();
  const projects: IRISProject[] = projectsData?.projects ?? [];

  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [launchState, setLaunchState] = useState<LaunchState>("idle");
  const [launchedProjectId, setLaunchedProjectId] = useState<string | null>(null);
  const [launchError, setLaunchError] = useState<string | null>(null);

  const selectedProject = projects.find((p) => p.id === (activeProject ?? projects[0]?.id));

  const handleLaunch = async () => {
    if (!selectedProject) return;
    setLaunchState("launching");
    setLaunchedProjectId(selectedProject.id);
    setLaunchError(null);
    try {
      await irisApi.setMode(selectedProject.mode);
      setTimeout(() => setLaunchState("running"), 2000);
    } catch (e) {
      setLaunchError((e as Error).message);
      setLaunchState("idle");
      setLaunchedProjectId(null);
    }
  };

  const handleStop = async () => {
    setLaunchState("idle");
    setLaunchedProjectId(null);
  };

  return (
    <PageTransition variant="slide-left">
      <div className="space-y-8">
        <SectionHeader
          title="Projects"
          description="Manage IRIS source projects — each with independent mode and path"
          action={
            <div className="flex items-center gap-3">
              {online === false ? (
                <span className="flex items-center gap-1 text-[10px] font-mono text-warning">
                  <WifiOff className="h-3 w-3" />IRIS offline
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-mono text-success">
                  <Wifi className="h-3 w-3" />Live
                </span>
              )}
              <Button variant="outline" size="sm" className="font-mono text-xs" disabled>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Project
              </Button>
            </div>
          }
        />

        <div className="space-y-3">
          {projects.map((project, i) => {
            const isActive = project.id === (activeProject ?? projects[0]?.id);
            const isLaunched = project.id === launchedProjectId && launchState === "running";
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring" as const, stiffness: 300, damping: 25 }}
                whileHover={{ y: -1, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                className={`glass-card rounded-2xl p-5 cursor-pointer ${isActive ? "border-primary/20" : ""} ${isLaunched ? "border-success/30 glow-success" : ""}`}
                onClick={() => setActiveProject(project.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <LiquidIcon color={isLaunched ? "success" : isActive ? "primary" : "neutral"} size="md" bounce={false}>
                      <HardDrive className="h-5 w-5" />
                    </LiquidIcon>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                        {isLaunched && <StatusBadge status="online" label="RUNNING" />}
                        {isActive && !isLaunched && <StatusBadge status="dormant" label="SELECTED" />}
                        {project.active && <StatusBadge status="online" label="ACTIVE" />}
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mt-1">{project.path}</p>
                      {project.branch && (
                        <p className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">
                          branch: {project.branch}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono ${
                            project.mode === "developer"
                              ? "liquid-icon-accent text-accent"
                              : "glass-subtle text-secondary-foreground"
                          }`}
                        >
                          <Shield className="h-2.5 w-2.5" />
                          {project.mode.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono glass-subtle text-muted-foreground">
                          <FolderOpen className="h-2.5 w-2.5" />
                          {project.driveType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {projects.length === 0 && (
            <div className="glass-card rounded-2xl p-8 text-center">
              <p className="text-sm text-muted-foreground">
                {online === false ? "IRIS backend is offline — start it to see projects" : "No projects found"}
              </p>
            </div>
          )}
        </div>

        {/* Launch Section */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AnimatePresence mode="wait">
                  {launchState === "launching" ? (
                    <motion.div key="launching" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <AgentOrb active size="md" />
                    </motion.div>
                  ) : launchState === "running" ? (
                    <motion.div key="running" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <LiquidIcon color="success" size="lg" bounce>
                        <CheckCircle className="h-6 w-6" />
                      </LiquidIcon>
                    </motion.div>
                  ) : (
                    <motion.div key="idle" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                      <LiquidIcon color="primary" size="lg" bounce={false}>
                        <Rocket className="h-6 w-6" />
                      </LiquidIcon>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {launchState === "launching"
                      ? "Activating mode…"
                      : launchState === "running"
                      ? "Mode Active"
                      : "Activate Mode"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 tracking-wide">
                    {launchState === "launching"
                      ? `Setting ${selectedProject.name} → ${selectedProject.mode} mode…`
                      : launchState === "running"
                      ? `${selectedProject.name} · ${selectedProject.mode.toUpperCase()} mode active`
                      : `Selected: ${selectedProject.name} · ${selectedProject.mode.toUpperCase()} mode`}
                  </p>
                  {launchError && (
                    <p className="text-xs font-mono text-destructive mt-1">{launchError}</p>
                  )}
                </div>
              </div>

              <div>
                {launchState === "idle" && (
                  <Button
                    onClick={handleLaunch}
                    className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                    size="lg"
                    disabled={online === false}
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
                {launchState === "running" && (
                  <Button
                    onClick={handleStop}
                    variant="outline"
                    className="font-mono border-destructive/30 text-destructive hover:bg-destructive/10 px-6"
                    size="lg"
                  >
                    Deactivate
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Mode Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <p className="font-mono text-secondary-foreground font-bold tracking-wide">PERSONAL MODE</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Agent uses IRIS for tasks — unrestricted</li>
                <li>• Reads/writes config/ and skills/</li>
                <li>• src/ writes blocked — always</li>
                <li>• No git or cargo required</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-mono text-accent font-bold tracking-wide">DEVELOPER MODE</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Full agent access + source modification</li>
                <li>• src/ writes queued for diff review</li>
                <li>• Every write is a git commit</li>
                <li>• PROJECT.md injected into system prompt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProjectsPage;
