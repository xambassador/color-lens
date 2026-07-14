import {
  formatCss,
  formatHex,
  formatHex8,
  formatHsl,
  formatRgb,
  modeHsl,
  modeHwb,
  modeLab,
  modeLrgb,
  modeOklab,
  modeOklch,
  modeRgb,
  parse,
  useMode,
  wcagContrast
} from "culori/fn";
import type { Color } from "culori/fn";

import { persistPanelState } from "./store";
import type { ColorFormat, WCAG_LEVEL } from "./types";

// https://culorijs.org/api/#color-spaces
useMode(modeRgb);
useMode(modeLrgb);
useMode(modeOklab);
useMode(modeHsl);
useMode(modeLab);
const toOklch = useMode(modeOklch);
const toHwb = useMode(modeHwb);

export const POPUP_WIDTH = 240;
export const POPUP_HEIGHT = 300;
const FALLBACK_HEX = "#000000";
const NON_COLOR_KEYWORDS = new Set(["inherit", "initial", "unset", "revert", "revert-layer", "currentcolor", "none"]);

export function isColorValue(value: string): boolean {
  const v = value.toLowerCase();
  if (!v || NON_COLOR_KEYWORDS.has(v)) return false;
  return CSS.supports("color", v);
}

function roundChannels(color: Color): Color {
  const rounded = { ...color } as Record<string, unknown>;
  for (const [key, val] of Object.entries(rounded)) {
    if (typeof val === "number") rounded[key] = Math.round(val * 10000) / 10000;
  }
  return rounded as unknown as Color;
}

export function toFormat(value: string, target: ColorFormat): string {
  const color = parse(value);
  if (!color) return value;

  switch (target) {
    case "hex":
      return color.alpha !== undefined && color.alpha < 1 ? formatHex8(color) : formatHex(color);
    case "rgb":
      return formatRgb(color);
    case "hsl":
      return formatHsl(color);
    case "oklch":
      return formatCss(roundChannels(toOklch(color)));
    case "hwb":
      return formatCss(roundChannels(toHwb(color)));
  }
}

export function toHex6(value: string): string {
  const color = parse(value);
  return color ? formatHex(color) : FALLBACK_HEX;
}

export function contrastRatio(a: string, b: string): number {
  return wcagContrast(a, b);
}

export function wcagLevel(ratio: number): WCAG_LEVEL {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  return "fail";
}

export function silentlyFail<T, V>(fn: () => T, fallbackVal?: V): T | V {
  try {
    return fn();
  } catch {
    return fallbackVal as V;
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function trackPointer(e: PointerEvent, onMove: (dx: number, dy: number) => void) {
  const startX = e.clientX;
  const startY = e.clientY;
  const move = (ev: PointerEvent) => onMove(ev.clientX - startX, ev.clientY - startY);
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    persistPanelState();
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
