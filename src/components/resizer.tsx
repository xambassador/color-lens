import { panelSize } from "../store";
import { clamp, trackPointer } from "../utils";

export function Resizer() {
  const onResizeStart = (e: PointerEvent) => {
    e.preventDefault();
    const from = { ...panelSize.value };
    trackPointer(e, (dx, dy) => {
      panelSize.value = {
        w: clamp(from.w + dx, 280, 700),
        h: clamp(from.h + dy, 240, window.innerHeight - 32)
      };
    });
  };

  return <div class="resize-handle" onPointerDown={onResizeStart} />;
}
