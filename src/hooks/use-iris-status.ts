import { useState, useEffect } from "react";
import { irisApi, LauncherStatus, GitStatus } from "@/lib/iris-api";

interface IRISStatus {
  launcher: LauncherStatus | null;
  git: GitStatus | null;
  online: boolean;
  loading: boolean;
}

const POLL_INTERVAL = 10_000; // 10s

export function useIRISStatus(): IRISStatus {
  const [online, setOnline] = useState(false);
  const [launcher, setLauncher] = useState<LauncherStatus | null>(null);
  const [git, setGit] = useState<GitStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      const isOnline = await irisApi.isOnline();
      if (cancelled) return;
      setOnline(isOnline);

      if (!isOnline) {
        setLoading(false);
        return;
      }

      const [launcherResult, gitResult] = await Promise.allSettled([
        irisApi.getLauncherStatus(),
        irisApi.getGitStatus(),
      ]);

      if (cancelled) return;

      if (launcherResult.status === "fulfilled") setLauncher(launcherResult.value);
      if (gitResult.status === "fulfilled") setGit(gitResult.value);
      setLoading(false);
    }

    fetchAll();
    const id = setInterval(fetchAll, POLL_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { launcher, git, online, loading };
}
