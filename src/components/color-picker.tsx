import "vanilla-colorful";
import type { TargetedEvent } from "preact";
import { useState } from "preact/hooks";

import { usePicker } from "../hooks/use-picker";
import { activePicker, colorVars, setColorVar } from "../store";
import type { ColorFormat } from "../types";
import { isColorValue, toFormat, toHex6, POPUP_WIDTH, POPUP_HEIGHT } from "../utils";
import { FORMATS } from "./toolbar";

export function ColorPicker() {
  const state = activePicker.value;
  if (!state) return null;
  return <PickerPopup key={state.name} name={state.name} x={state.x} y={state.y} />;
}

function PickerPopup({ name, x, y }: { name: string; x: number; y: number }) {
  const { ref } = usePicker({ name });

  const v = colorVars.value.get(name);
  if (!v) return null;

  const left = Math.min(Math.max(x, 8), window.innerWidth - POPUP_WIDTH - 8);
  const top = y + POPUP_HEIGHT > window.innerHeight ? Math.max(y - POPUP_HEIGHT - 36, 8) : y;

  return (
    <>
      <div class="picker-backdrop" onPointerDown={() => (activePicker.value = null)} />
      <div class="picker-popup" style={{ left, top, width: POPUP_WIDTH }}>
        <div class="picker-var" title={name}>
          {name}
        </div>
        {/* @ts-expect-error @fixme */}
        <hex-color-picker ref={ref} color={toHex6(v.value)} />
        <PickerTabs name={name} />
      </div>
    </>
  );
}

function PickerTabs({ name }: { name: string }) {
  const [tab, setTab] = useState<ColorFormat>("hex");
  const [draft, setDraft] = useState<string | null>(null);

  const onInput = (e: TargetedEvent<HTMLInputElement>) => {
    const text = (e.target as HTMLInputElement).value;
    setDraft(text);
    if (isColorValue(text)) setColorVar(name, text);
  };

  const v = colorVars.value.get(name);
  if (!v) return null;

  const formatted = toFormat(v.value, tab);

  return (
    <>
      <div class="picker-tabs">
        {FORMATS.map((f) => (
          <button
            key={f}
            class={`format-pill ${tab === f ? "active" : ""}`}
            onClick={() => {
              setTab(f);
              setDraft(null);
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <input
        class="picker-input"
        value={draft ?? formatted}
        spellcheck={false}
        onFocus={() => setDraft(formatted)}
        onInput={onInput}
        onBlur={() => setDraft(null)}
      />
    </>
  );
}
