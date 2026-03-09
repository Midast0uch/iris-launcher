import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ParallaxBackground } from "@/components/dashboard/ParallaxBackground";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import FirstRunPage from "./pages/FirstRunPage";
import ModeSelectPage from "./pages/ModeSelectPage";

const queryClient = new QueryClient();

const DashboardLayout = () => (
  <SidebarProvider>
    <ParallaxBackground />
    <div className="min-h-screen flex w-full relative">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-12 flex items-center justify-between border-b border-border px-4 glass-subtle">
          <div className="flex items-center">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
            <span className="ml-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
              IRIS Launcher
            </span>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <AnimatedRoutes />
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
);

const AppRoutes = () => {
  const { mode } = useApp();

  if (!mode) {
    return (
      <Routes>
        <Route path="/mode-select" element={<ModeSelectPage />} />
        <Route path="/first-run" element={<div className="min-h-screen"><FirstRunPage /></div>} />
        <Route path="*" element={<Navigate to="/mode-select" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/first-run" element={<div className="min-h-screen"><FirstRunPage /></div>} />
      <Route path="/mode-select" element={<ModeSelectPage />} />
      <Route path="*" element={<DashboardLayout />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
