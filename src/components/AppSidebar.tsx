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
import { motion } from "framer-motion";
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
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <motion.div
              className="h-9 w-9 rounded-xl liquid-icon liquid-icon-primary flex items-center justify-center"
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <span className="font-mono text-sm font-bold text-primary">IR</span>
            </motion.div>
            <div>
              <h2 className="text-sm font-semibold text-foreground tracking-tight">IRIS Launcher</h2>
              <p className="text-[10px] text-muted-foreground tracking-wide">
                {mode === "developer" ? "Developer" : "Personal"}
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <motion.div
              className="h-9 w-9 rounded-xl liquid-icon liquid-icon-primary flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <span className="font-mono text-xs font-bold text-primary">IR</span>
            </motion.div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground px-3">
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
                      className="text-sidebar-foreground hover:bg-[hsl(0_0%_100%/0.04)] hover:text-foreground rounded-xl transition-all duration-200"
                      activeClassName="bg-primary/8 text-primary"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span className="text-sm tracking-wide">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {mode === "developer" && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground px-3">
              Developer
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {devItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="text-sidebar-foreground hover:bg-[hsl(0_0%_100%/0.04)] hover:text-foreground rounded-xl transition-all duration-200"
                        activeClassName="bg-primary/8 text-primary"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span className="text-sm tracking-wide">{item.title}</span>}
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
          <div className="space-y-3">
            <button
              onClick={() => navigate("/mode-select")}
              className="flex items-center gap-2 text-[10px] text-muted-foreground hover:text-foreground transition-colors w-full tracking-wide"
            >
              <Settings className="h-3 w-3" />
              <span>Switch Mode</span>
            </button>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <motion.div
                className="h-2 w-2 rounded-full bg-success"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span>System Healthy</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <motion.div
              className="h-2 w-2 rounded-full bg-success"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
