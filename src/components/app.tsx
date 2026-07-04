import { useScanner } from "../use-scanner";
import { Panel } from "./panel";

export function App() {
  useScanner();
  return <Panel />;
}
