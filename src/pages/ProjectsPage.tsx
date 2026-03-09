import { HardDrive, Plus, FolderOpen, Shield, Trash2, ExternalLink } from "lucide-react";
import { SectionHeader, StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";
import { mockProjects } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PageTransition } from "@/components/dashboard/PageTransition";
import { motion } from "framer-motion";

const ProjectsPage = () => {
  const [activeProject, setActiveProject] = useState("development");

  return (
    <PageTransition>
      <div className="space-y-8">
        <SectionHeader
          title="Projects"
          description="Manage IRIS source projects — each with independent mode and path"
          action={
            <Button variant="outline" size="sm" className="font-mono text-xs border-primary/30 text-primary hover:bg-primary/10 hover:text-primary">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Project
            </Button>
          }
        />

        <div className="space-y-3">
          {mockProjects.map((project, i) => {
            const isActive = project.id === activeProject;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring" as const, stiffness: 300, damping: 25 }}
                whileHover={{ y: -1, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                className={`glass-card rounded-2xl p-5 cursor-pointer ${isActive ? "border-primary/30 glow-primary" : ""}`}
                onClick={() => setActiveProject(project.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <LiquidIcon color={isActive ? "primary" : "neutral"} size="md" bounce={false}>
                      <HardDrive className="h-5 w-5" />
                    </LiquidIcon>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                        {isActive && <StatusBadge status="online" label="ACTIVE" />}
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
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"><ExternalLink className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

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
