import { colorCount, minimized, panelPos } from "../store";
import { clamp, trackPointer } from "../utils";

export function PanelHeader() {
  const onDragStart = (e: PointerEvent) => {
    const isClickOnControl = (e.target as HTMLElement).closest("button, input, select");
    if (isClickOnControl) return;
    e.preventDefault();
    const from = { ...panelPos.value };
    trackPointer(e, (dx, dy) => {
      panelPos.value = {
        x: clamp(from.x + dx, 0, window.innerWidth - 80),
        y: clamp(from.y + dy, 0, window.innerHeight - 40)
      };
    });
  };

  return (
    <header class="panel-header" onPointerDown={onDragStart}>
      <span class="pill-logo" />
      <span class="panel-title">color lens</span>
      <ColorCount />
      <button class="icon-btn" title="Minimize (Alt+C hides completely)" onClick={() => (minimized.value = true)}>
        &minus;
      </button>
    </header>
  );
}

function ColorCount() {
  return <span class="panel-count">{colorCount.value} vars</span>;
}
