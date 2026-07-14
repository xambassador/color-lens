import { minimized, modifiedCount, panelOpen, panelPos, panelSize } from "../store";
import { ColorList } from "./color-list";
import { ColorPicker } from "./color-picker";
import { ContrastChecker } from "./contrast-checker";
import { ErrorBoundary } from "./error-boundary";
import { PanelHeader } from "./panel-header";
import { Resizer } from "./resizer";
import { Toast } from "./toast";
import { Toolbar } from "./toolbar";

export function Panel() {
  const pos = panelPos.value;
  const size = panelSize.value;

  if (!panelOpen.value) return null;

  if (minimized.value) {
    return (
      <button
        class="pill"
        style={{ left: pos.x, top: pos.y }}
        onClick={() => (minimized.value = false)}
        title="Expand color lens"
      >
        <span class="pill-logo" />
        color lens
        {modifiedCount.value > 0 && <span class="pill-badge">{modifiedCount.value}</span>}
      </button>
    );
  }

  return (
    <div class="panel" style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}>
      <PanelHeader />
      <Toolbar />
      <div class="panel-body">
        <ErrorBoundary label="Contrast checker" hint={hint}>
          <ContrastChecker />
        </ErrorBoundary>
        <ColorList />
      </div>
      <Resizer />
      <ColorPicker />
      <Toast />
    </div>
  );
}

const hint =
  "If one of your colors uses a format like lch() or color(display-p3 ...) that isn't shown in the panel, that's likely why - try switching it to rgb, hsl, oklch, oklab, lab, or hwb.";
