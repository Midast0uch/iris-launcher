import { HardDrive, Plus, FolderOpen, Shield, Trash2, ExternalLink } from "lucide-react";
import { SectionHeader, StatusBadge } from "@/components/dashboard/DashboardPrimitives";
import { mockProjects } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PageTransition } from "@/components/dashboard/PageTransition";

const ProjectsPage = () => {
  const [activeProject, setActiveProject] = useState("development");

  return (
    <PageTransition><div className="space-y-8">
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
        {mockProjects.map((project) => {
          const isActive = project.id === activeProject;
          return (
            <div
              key={project.id}
              className={`bg-card rounded-lg border p-5 transition-all cursor-pointer ${
                isActive
                  ? "border-primary/40 glow-primary"
                  : "border-border hover:border-primary/20"
              }`}
              onClick={() => setActiveProject(project.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-10 w-10 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-primary/20 border border-primary/30" : "bg-secondary border border-border"
                  }`}>
                    <HardDrive className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground">{project.name}</h3>
                      {isActive && <StatusBadge status="online" label="ACTIVE" />}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-1">{project.path}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                        project.mode === "developer"
                          ? "bg-accent/10 border-accent/30 text-accent"
                          : "bg-secondary border-border text-secondary-foreground"
                      }`}>
                        <Shield className="h-2.5 w-2.5" />
                        {project.mode.toUpperCase()}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-secondary border border-border text-muted-foreground">
                        <FolderOpen className="h-2.5 w-2.5" />
                        {project.driveType.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mode explanation */}
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">Mode Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <p className="font-mono text-secondary-foreground font-bold">STANDARD MODE</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Agent uses IRIS for tasks — unrestricted</li>
              <li>• Reads/writes config/ and skills/</li>
              <li>• src/ writes blocked — always</li>
              <li>• No git or cargo required</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-mono text-accent font-bold">DEVELOPER MODE</p>
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
  );
};

export default ProjectsPage;
