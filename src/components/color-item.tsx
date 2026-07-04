import { activePicker, copyText, format, resetColorVar } from "../store";
import type { CSSColorVar } from "../types";
import { toFormat } from "../utils";

export function ColorItem({ v }: { v: CSSColorVar }) {
  const display = toFormat(v.value, format.value);

  const openPicker = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    activePicker.value = { name: v.name, x: rect.left, y: rect.bottom + 6 };
  };

  return (
    <div class="color-item">
      <button class="swatch" title="Edit color" onClick={openPicker}>
        <span class="swatch-fill" style={{ background: v.value }} />
      </button>
      <span class="var-name" title={v.name}>
        {v.name}
      </span>
      {v.modified && (
        <>
          <span class="modified-dot" title={`Original: ${v.original}`} />
          <button class="icon-btn reset-btn" title="Reset to original" onClick={() => resetColorVar(v.name)}>
            ↺
          </button>
        </>
      )}
      <button class="value-chip" title="Copy value" onClick={() => copyText(display, `Copied ${display}`)}>
        {display}
      </button>
    </div>
  );
}
