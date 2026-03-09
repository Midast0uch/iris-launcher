import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useApp } from "@/contexts/AppContext";
import OverviewPage from "@/pages/OverviewPage";
import IdentityPage from "@/pages/IdentityPage";
import ProjectsPage from "@/pages/ProjectsPage";
import TailscalePage from "@/pages/TailscalePage";
import GitPage from "@/pages/GitPage";
import DiffReviewPage from "@/pages/DiffReviewPage";
import RebuildPage from "@/pages/RebuildPage";
import GitHubPage from "@/pages/GitHubPage";
import NotFound from "@/pages/NotFound";

export function AnimatedRoutes() {
  const location = useLocation();
  const { mode } = useApp();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/identity" element={<IdentityPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tailscale" element={<TailscalePage />} />
        {mode === "developer" && (
          <>
            <Route path="/developer/github" element={<GitHubPage />} />
            <Route path="/developer/git" element={<GitPage />} />
            <Route path="/developer/diff" element={<DiffReviewPage />} />
            <Route path="/developer/rebuild" element={<RebuildPage />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
