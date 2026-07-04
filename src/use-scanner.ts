import { useEffect } from "preact/hooks";

import { watchForChanges } from "./scanner";
import { refreshColorVars } from "./store";

export function useScanner() {
  useEffect(() => {
    refreshColorVars();
    const observer = watchForChanges(refreshColorVars);
    return () => {
      observer.disconnect();
    };
  }, []);
}
