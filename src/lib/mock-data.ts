// Mock data representing the IRIS Launcher backend state

export interface Project {
  id: string;
  name: string;
  path: string;
  mode: "standard" | "developer";
  driveType: "local" | "usb" | "network";
}

export interface Identity {
  nodeId: string;
  networkStatus: "dormant" | "active";
  biometricActive: boolean;
  createdAt: string;
  publicKey: string;
}

export interface LauncherStatus {
  mode: "standard" | "developer";
  sourceValid: boolean;
  driveConnected: boolean;
  agentActive: boolean;
  pendingWrites: number;
  uptime: string;
  version: string;
}

export interface GitStatus {
  branch: string;
  clean: boolean;
  lastCommit: string;
  lastCommitMessage: string;
  lastGoodCommit: string;
  uncommittedFiles: string[];
}

export interface PendingWrite {
  id: string;
  path: string;
  diff: string;
  description: string;
  timestamp: string;
}

export interface RebuildStatus {
  required: boolean;
  lastBuild: string;
  lastGoodCommit: string;
  buildOutput?: string;
}

export interface NetworkPermission {
  skill: string;
  allowed: boolean;
  lastUsed?: string;
}

export interface FileEntry {
  name: string;
  isDir: boolean;
  size: number;
  modified: string;
}

// Mock data
export const mockIdentity: Identity = {
  nodeId: "a3f9d2c1e8b74f6d",
  networkStatus: "dormant",
  biometricActive: true,
  createdAt: "2026-02-15T08:30:00Z",
  publicKey: "dil3-pk-7a8c9f2e1b3d5e6f8a0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b",
};

export const mockProjects: Project[] = [
  { id: "personal", name: "Personal", path: "/Users/iris/projects/personal", mode: "standard", driveType: "local" },
  { id: "development", name: "Development", path: "/Volumes/IRIS-Dev/iris-source", mode: "developer", driveType: "usb" },
  { id: "work", name: "Work Agent", path: "/Users/iris/projects/work", mode: "standard", driveType: "local" },
];

export const mockLauncherStatus: LauncherStatus = {
  mode: "developer",
  sourceValid: true,
  driveConnected: true,
  agentActive: true,
  pendingWrites: 2,
  uptime: "4h 32m",
  version: "0.2.1-alpha",
};

export const mockGitStatus: GitStatus = {
  branch: "main",
  clean: false,
  lastCommit: "e4a7c3f",
  lastCommitMessage: "agent: update web_search skill parameters",
  lastGoodCommit: "b2d1a9e",
  uncommittedFiles: ["skills/web_search.rs", "config/models.json"],
};

export const mockPendingWrites: PendingWrite[] = [
  {
    id: "pw-001",
    path: "src/commands.rs",
    diff: `@@ -142,7 +142,9 @@\n pub fn handle_query(state: AppState, query: String) -> Result<QueryResult> {\n-    let result = state.agent.process(query)?;\n+    let result = state.agent.process(query.clone())?;\n+    state.history.push(query, &result);\n     Ok(result)\n }`,
    description: "Add query history tracking to handle_query command",
    timestamp: "2026-03-09T14:22:00Z",
  },
  {
    id: "pw-002",
    path: "src/identity.rs",
    diff: `@@ -88,6 +88,12 @@\n pub fn get_identity(state: AppState) -> Result<IdentityInfo> {\n+    // Cache identity info for 60 seconds\n+    if let Some(cached) = state.identity_cache.get() {\n+        if cached.age() < Duration::from_secs(60) {\n+            return Ok(cached.value.clone());\n+        }\n+    }\n     let entry = keyring::Entry::new("iris-launcher", "identity")?;`,
    description: "Add 60-second cache for identity lookups to reduce keychain calls",
    timestamp: "2026-03-09T14:25:00Z",
  },
];

export const mockRebuildStatus: RebuildStatus = {
  required: true,
  lastBuild: "2026-03-09T10:15:00Z",
  lastGoodCommit: "b2d1a9e",
};

export const mockNetworkPermissions: NetworkPermission[] = [
  { skill: "web_search", allowed: true, lastUsed: "2026-03-09T14:10:00Z" },
  { skill: "email_send", allowed: false },
  { skill: "api_call", allowed: true, lastUsed: "2026-03-09T13:45:00Z" },
  { skill: "file_download", allowed: false },
  { skill: "webhook_trigger", allowed: true, lastUsed: "2026-03-08T22:00:00Z" },
];

export const mockFiles: FileEntry[] = [
  { name: "src", isDir: true, size: 0, modified: "2026-03-09T14:25:00Z" },
  { name: "skills", isDir: true, size: 0, modified: "2026-03-09T14:22:00Z" },
  { name: "config", isDir: true, size: 0, modified: "2026-03-09T13:00:00Z" },
  { name: "Cargo.toml", isDir: false, size: 2048, modified: "2026-03-09T10:15:00Z" },
  { name: "Cargo.lock", isDir: false, size: 45312, modified: "2026-03-09T10:15:00Z" },
  { name: "README.md", isDir: false, size: 4096, modified: "2026-02-28T09:00:00Z" },
];
