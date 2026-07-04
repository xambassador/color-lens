import "vanilla-colorful";
import type { TargetedEvent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { activePicker, colorVars, setColorVar } from "../store";
import type { ColorFormat } from "../types";
import { isColorValue, toFormat, toHex6 } from "../utils";
import { FORMATS } from "./toolbar";

const POPUP_WIDTH = 240;
const POPUP_HEIGHT = 300;

export function ColorPicker() {
  const state = activePicker.value;
  if (!state) return null;
  return <PickerPopup key={state.name} name={state.name} x={state.x} y={state.y} />;
}

function PickerPopup({ name, x, y }: { name: string; x: number; y: number }) {
  const pickerRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<ColorFormat>("hex");
  const [draft, setDraft] = useState<string | null>(null);

  useEffect(() => {
    const el = pickerRef.current;
    if (!el) return;
    const onColorChanged = (e: Event) => setColorVar(name, (e as CustomEvent<{ value: string }>).detail.value);
    el.addEventListener("color-changed", onColorChanged);
    return () => el.removeEventListener("color-changed", onColorChanged);
  }, [name]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") activePicker.value = null;
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const v = colorVars.value.get(name);
  if (!v) return null;

  const left = Math.min(Math.max(x, 8), window.innerWidth - POPUP_WIDTH - 8);
  const top = y + POPUP_HEIGHT > window.innerHeight ? Math.max(y - POPUP_HEIGHT - 36, 8) : y;

  const formatted = toFormat(v.value, tab);

  const onInput = (e: TargetedEvent<HTMLInputElement>) => {
    const text = (e.target as HTMLInputElement).value;
    setDraft(text);
    if (isColorValue(text)) setColorVar(name, text);
  };

  return (
    <>
      <div class="picker-backdrop" onPointerDown={() => (activePicker.value = null)} />
      <div class="picker-popup" style={{ left, top, width: POPUP_WIDTH }}>
        <div class="picker-var" title={name}>
          {name}
        </div>
        {/* @ts-expect-error @fixme */}
        <hex-color-picker ref={pickerRef} color={toHex6(v.value)} />
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
      </div>
    </>
  );
}
