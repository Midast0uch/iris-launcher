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

  return (
    <AppContext.Provider value={{ identity, setIdentity, mode, setMode, clearIdentity }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
