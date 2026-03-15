/**
 * useIRISMode — sync the launcher AppContext mode to the IRISVOICE backend.
 *
 * Calls POST http://localhost:8000/api/mode whenever the user selects a mode
 * in ModeSelectPage (or any other place setMode() is called).
 *
 * Usage:
 *   import { useIRISMode } from "@/hooks/use-iris-mode";
 *
 *   const { setMode } = useIRISMode();
 *   setMode("developer");  // updates AppContext AND notifies backend
 */

import { useCallback } from "react";
import { useApp, AppMode } from "@/contexts/AppContext";

const IRIS_BACKEND = "http://localhost:8000";

export function useIRISMode() {
  const { mode, setMode: setAppMode } = useApp();

  const setMode = useCallback(
    async (newMode: AppMode) => {
      // 1. Update AppContext immediately (local state)
      setAppMode(newMode);

      // 2. Notify IRISVOICE backend (fire-and-forget — non-fatal if offline)
      if (newMode) {
        try {
          const res = await fetch(`${IRIS_BACKEND}/api/mode`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: newMode }),
          });
          if (!res.ok) {
            console.warn(`[IRIS] mode sync failed (${res.status}):`, await res.text());
          } else {
            console.log(`[IRIS] mode synced to backend: ${newMode}`);
          }
        } catch (err) {
          // Backend may not be running — that's ok, try again on reconnect
          console.warn("[IRIS] backend unreachable — mode will sync on next connection", err);
        }
      }
    },
    [setAppMode]
  );

  return { mode, setMode };
}
