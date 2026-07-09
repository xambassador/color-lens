import { useState } from "preact/hooks";

import { activePicker, copyText, format, resetColorVar } from "../store";
import type { CSSColorVar } from "../types";
import { toFormat } from "../utils";

export function ColorItem({ v }: { v: CSSColorVar }) {
  const openPicker = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    activePicker.value = { name: v.name, x: rect.left, y: rect.bottom + 6 };
  };

  return (
    <div class="color-item">
      <div class="color-item-row">
        <button class="swatch" title="Edit color" onClick={openPicker}>
          <span class="swatch-fill" style={{ background: v.value }} />
        </button>
        <span class="var-name" title={v.name}>
          {v.name}
        </span>
        {v.modified && <ResetButton v={v} />}
        <DisplayValue v={v} />
      </div>
      {v.variants.length > 1 && <VariantRow v={v} />}
    </div>
  );
}

function VariantRow({ v }: { v: CSSColorVar }) {
  const [open, setOpen] = useState(false);

  return (
    <div class="variant-group">
      <button class="variant-toggle" onClick={() => setOpen(!open)}>
        <span class={`variant-chevron${open ? " open" : ""}`}>▸</span>
        {v.variants.length} variants
      </button>
      {open && (
        <div class="variant-list">
          {v.variants.map((variant) => {
            const isActive = variant === v.activeVariant;
            return (
              <div key={variant} class={`variant-entry${isActive ? "" : " inactive"}`}>
                <span class="variant-swatch" style={{ background: variant }} />
                <span class="variant-val">{toFormat(variant, format.value)}</span>
                {isActive && <span class="active-badge">active</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DisplayValue({ v }: { v: CSSColorVar }) {
  const display = toFormat(v.value, format.value);
  return (
    <button class="value-chip" title="Copy value" onClick={() => copyText(display, `Copied ${display}`)}>
      {display}
    </button>
  );
}

function ResetButton({ v }: { v: CSSColorVar }) {
  return (
    <>
      <span class="modified-dot" title={`Original: ${v.original}`} />
      <button class="icon-btn reset-btn" title="Reset to original" onClick={() => resetColorVar(v.name)}>
        ↺
      </button>
    </>
  );
}
