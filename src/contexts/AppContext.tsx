import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface IdentityData {
  nodeId: string;
  publicKey: string;
  createdAt: string;
}

export type AppMode = "personal" | "developer" | null;

interface AppContextType {
  identity: IdentityData | null;
  setIdentity: (id: IdentityData | null) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  clearIdentity: () => void;
  gitHubConnected: boolean;
  setGitHubConnected: (connected: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentityState] = useState<IdentityData | null>(() => {
    const stored = localStorage.getItem("iris-identity");
    return stored ? JSON.parse(stored) : null;
  });

  const [mode, setModeState] = useState<AppMode>(() => {
    return (localStorage.getItem("iris-mode") as AppMode) || null;
  });

  const [gitHubConnected, setGitHubConnectedState] = useState<boolean>(() => {
    return localStorage.getItem("iris-github-connected") === "true";
  });

  const setIdentity = useCallback((id: IdentityData | null) => {
    setIdentityState(id);
    if (id) {
      localStorage.setItem("iris-identity", JSON.stringify(id));
    } else {
      localStorage.removeItem("iris-identity");
    }
  }, []);

  const setMode = useCallback((m: AppMode) => {
    setModeState(m);
    if (m) {
      localStorage.setItem("iris-mode", m);
    } else {
      localStorage.removeItem("iris-mode");
    }
  }, []);

  const clearIdentity = useCallback(() => {
    setIdentityState(null);
    localStorage.removeItem("iris-identity");
  }, []);

  const setGitHubConnected = useCallback((connected: boolean) => {
    setGitHubConnectedState(connected);
    if (connected) {
      localStorage.setItem("iris-github-connected", "true");
    } else {
      localStorage.removeItem("iris-github-connected");
    }
  }, []);

  return (
    <AppContext.Provider value={{ identity, setIdentity, mode, setMode, clearIdentity, gitHubConnected, setGitHubConnected }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
