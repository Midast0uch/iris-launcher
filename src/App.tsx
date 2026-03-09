import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import OverviewPage from "./pages/OverviewPage";
import IdentityPage from "./pages/IdentityPage";
import ProjectsPage from "./pages/ProjectsPage";
import PermissionsPage from "./pages/PermissionsPage";
import GitPage from "./pages/GitPage";
import DiffReviewPage from "./pages/DiffReviewPage";
import RebuildPage from "./pages/RebuildPage";
import FirstRunPage from "./pages/FirstRunPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-12 flex items-center border-b border-border px-4 bg-card/50">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <span className="ml-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            IRIS Launcher Control Panel
          </span>
        </header>
        <main className="flex-1 p-6 overflow-auto grid-pattern scanline">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* First-run has no sidebar */}
          <Route path="/first-run" element={
            <div className="min-h-screen grid-pattern scanline">
              <FirstRunPage />
            </div>
          } />
          {/* Dashboard routes */}
          <Route path="*" element={
            <DashboardLayout>
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/identity" element={<IdentityPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/permissions" element={<PermissionsPage />} />
                <Route path="/developer/git" element={<GitPage />} />
                <Route path="/developer/diff" element={<DiffReviewPage />} />
                <Route path="/developer/rebuild" element={<RebuildPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DashboardLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
