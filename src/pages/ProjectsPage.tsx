import { HardDrive, Plus, FolderOpen, Shield, Trash2, Rocket, CheckCircle } from "lucide-react";
import { SectionHeader, StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { mockProjects } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { AgentOrb } from "@/components/dashboard/AgentOrb";
import { motion, AnimatePresence } from "framer-motion";

type LaunchState = "idle" | "launching" | "running";

const ProjectsPage = () => {
  const [activeProject, setActiveProject] = useState("development");
  const [launchState, setLaunchState] = useState<LaunchState>("idle");
  const [launchedProjectId, setLaunchedProjectId] = useState<string | null>(null);

  const selectedProject = mockProjects.find((p) => p.id === activeProject);

  const handleLaunch = () => {
    setLaunchState("launching");
    setLaunchedProjectId(activeProject);
    setTimeout(() => setLaunchState("running"), 2500);
  };

  const handleStop = () => {
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
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Project
            </Button>
          }
        />

        <div className="space-y-3">
          {mockProjects.map((project, i) => {
            const isActive = project.id === activeProject;
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
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mt-1">{project.path}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono ${
                          project.mode === "developer" ? "liquid-icon-accent text-accent" : "glass-subtle text-secondary-foreground"
                        }`}>
                          <Shield className="h-2.5 w-2.5" />{project.mode.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono glass-subtle text-muted-foreground">
                          <FolderOpen className="h-2.5 w-2.5" />{project.driveType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Launch Section */}
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
                  <motion.div
                    key="launching"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <AgentOrb active size="md" />
                  </motion.div>
                ) : launchState === "running" ? (
                  <motion.div
                    key="running"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <LiquidIcon color="success" size="lg" bounce>
                      <CheckCircle className="h-6 w-6" />
                    </LiquidIcon>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <LiquidIcon color="primary" size="lg" bounce={false}>
                      <Rocket className="h-6 w-6" />
                    </LiquidIcon>
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {launchState === "launching"
                    ? "Launching IRIS..."
                    : launchState === "running"
                    ? "IRIS Running"
                    : "Launch IRIS"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 tracking-wide">
                  {launchState === "launching"
                    ? `Starting ${selectedProject?.name} in ${selectedProject?.mode} mode...`
                    : launchState === "running"
                    ? `${selectedProject?.name} · ${selectedProject?.mode.toUpperCase()} mode · ${selectedProject?.path}`
                    : `Selected: ${selectedProject?.name} · ${selectedProject?.mode.toUpperCase()} mode`}
                </p>
                {launchState === "launching" && (
                  <div className="space-y-1.5 mt-3">
                    {["Loading identity from keychain", "Validating source integrity", "Starting agent runtime"].map((step, i) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.6, type: "spring", stiffness: 300, damping: 25 }}
                        className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground"
                      >
                        <span className="h-1 w-1 rounded-full bg-success animate-pulse-glow" />
                        {step}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              {launchState === "idle" && (
                <Button
                  onClick={handleLaunch}
                  className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                  size="lg"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Launch
                </Button>
              )}
              {launchState === "running" && (
                <Button
                  onClick={handleStop}
                  variant="outline"
                  className="font-mono border-destructive/30 text-destructive hover:bg-destructive/10 px-6"
                  size="lg"
                >
                  Stop
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Mode Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-2">
              <p className="font-mono text-secondary-foreground font-bold tracking-wide">STANDARD MODE</p>
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
                <li>• Rebuild pipeline with test-before-replace</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProjectsPage;
