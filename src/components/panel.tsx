import { minimized, modifiedCount, panelOpen, panelPos, panelSize } from "../store";
import { ColorList } from "./color-list";
import { ColorPicker } from "./color-picker";
import { ContrastChecker } from "./contrast-checker";
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
        title="Expand cooolers"
      >
        <span class="pill-logo" />
        cooolers
        {modifiedCount.value > 0 && <span class="pill-badge">{modifiedCount.value}</span>}
      </button>
    );
  }

  return (
    <div class="panel" style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}>
      <PanelHeader />
      <Toolbar />
      <div class="panel-body">
        <ContrastChecker />
        <ColorList />
      </div>
      <Resizer />
      <ColorPicker />
      <Toast />
    </div>
  );
}
