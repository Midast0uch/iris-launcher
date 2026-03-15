/**
 * IRISVOICE backend API client
 * Base URL: http://localhost:8000 (dev server default)
 */

const BASE = "http://localhost:8000";

export interface GitStatus {
  branch: string;
  clean: boolean;
  lastCommit: string;
  lastCommitMessage: string;
  lastGoodCommit: string;
  uncommittedFiles: string[];
  error?: string;
}

export interface GitCommit {
  hash: string;
  message: string;
  time: string;
  auto: boolean;
}

export interface PendingWrite {
  id: string;
  path: string;
  diff: string;
  description: string;
  timestamp: string;
  content?: string;
}

export interface IRISProject {
  id: string;
  name: string;
  path: string;
  mode: "personal" | "developer";
  driveType: "local" | "usb" | "network";
  branch?: string;
  active?: boolean;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const irisApi = {
  getGitStatus: () => apiFetch<GitStatus>("/api/git/status"),

  getGitLog: (limit = 20) =>
    apiFetch<{ commits: GitCommit[] }>(`/api/git/log?limit=${limit}`),

  commitAll: (message: string) =>
    apiFetch<{ status: string }>("/api/git/commit", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  rollback: (target: string) =>
    apiFetch<{ status: string }>("/api/git/rollback", {
      method: "POST",
      body: JSON.stringify({ target }),
    }),

  getPendingWrites: () =>
    apiFetch<{ pending: PendingWrite[] }>("/api/diff/pending"),

  approveWrite: (id: string) =>
    apiFetch<{ status: string }>("/api/diff/approve", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

  rejectWrite: (id: string) =>
    apiFetch<{ status: string }>("/api/diff/reject", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

  getProjects: () =>
    apiFetch<{ projects: IRISProject[] }>("/api/projects"),

  getMode: () => apiFetch<{ mode: string }>("/api/mode"),

  setMode: (mode: "personal" | "developer") =>
    apiFetch<{ status: string; mode: string }>("/api/mode", {
      method: "POST",
      body: JSON.stringify({ mode }),
    }),

  isOnline: async (): Promise<boolean> => {
    try {
      await fetch(`${BASE}/`, { method: "HEAD", signal: AbortSignal.timeout(2000) });
      return true;
    } catch {
      return false;
    }
  },
};
