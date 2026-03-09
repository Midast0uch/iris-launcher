import {
  Activity,
  FolderGit2,
  Fingerprint,
  LayoutDashboard,
  Network,
  HardDrive,
  Wrench,
  Settings,
  Github,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Identity", url: "/identity", icon: Fingerprint },
  { title: "Projects", url: "/projects", icon: HardDrive },
  { title: "Tailscale", url: "/tailscale", icon: Network },
];

const devItems = [
  { title: "GitHub", url: "/developer/github", icon: Github },
  { title: "Git & Source", url: "/developer/git", icon: FolderGit2 },
  { title: "Diff Review", url: "/developer/diff", icon: Activity },
  { title: "Rebuild", url: "/developer/rebuild", icon: Wrench },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { mode } = useApp();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-[hsl(0_0%_100%/0.06)]">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <span className="font-mono text-sm font-bold text-primary">IR</span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">IRIS Launcher</h2>
              <p className="text-[10px] text-muted-foreground">
                {mode === "developer" ? "Developer" : "Personal"}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-9 w-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-primary">IR</span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground px-3">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="text-sidebar-foreground hover:bg-[hsl(0_0%_100%/0.06)] hover:text-foreground rounded-lg transition-all"
                      activeClassName="bg-primary/10 text-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {mode === "developer" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground px-3">
              Developer
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {devItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="text-sidebar-foreground hover:bg-[hsl(0_0%_100%/0.06)] hover:text-foreground rounded-lg transition-all"
                        activeClassName="bg-primary/10 text-primary"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="space-y-2">
            <button
              onClick={() => navigate("/mode-select")}
              className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <Settings className="h-3 w-3" />
              <span>Switch Mode</span>
            </button>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
              <span>System Healthy</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
