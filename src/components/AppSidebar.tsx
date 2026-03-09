import {
  Activity,
  FolderGit2,
  Fingerprint,
  LayoutDashboard,
  Network,
  HardDrive,
  Wrench,
  Settings,
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
  { title: "Permissions", url: "/permissions", icon: Shield },
];

const devItems = [
  { title: "Git & Source", url: "/developer/git", icon: FolderGit2 },
  { title: "Diff Review", url: "/developer/diff", icon: Activity },
  { title: "Rebuild", url: "/developer/rebuild", icon: Wrench },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { mode, setMode } = useApp();
  const navigate = useNavigate();

  const handleSwitchMode = () => {
    navigate("/mode-select");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center glow-primary">
              <span className="font-mono text-sm font-bold text-primary">IR</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">IRIS Launcher</h2>
              <p className="text-[10px] font-mono text-muted-foreground">
                {mode === "developer" ? "Developer Mode" : "Personal Mode"}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center glow-primary">
              <span className="font-mono text-xs font-bold text-primary">IR</span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
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
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-primary/10 text-primary border-l-2 border-primary"
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
            <SidebarGroupLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Developer Mode
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {devItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        activeClassName="bg-primary/10 text-primary border-l-2 border-primary"
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
              onClick={handleSwitchMode}
              className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <Settings className="h-3 w-3" />
              <span>Switch Mode</span>
            </button>
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
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
