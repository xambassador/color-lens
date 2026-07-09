import { computed, signal } from "@preact/signals";

import { scanColorVars } from "./scanner";
import type { ColorFormat, CSSColorVar, Group, PersistedPanelState } from "./types";
import { toFormat, silentlyFail } from "./utils";

const GROUP_PREFIXES = ["--color", "--bg", "--text", "--border", "--ring", "--shadow"];
const OTHER_LABEL = "other";
const STORAGE_KEY = "__colorlens_panel__";
const PANEL_WIDTH = 340;
const PANEL_HEIGHT = 480;
const PANEL_X = 16;
const PANEL_Y = 16;
const TOAST_DURATION = 1600;

let toastTimer: number | undefined;

function getPanelState(): PersistedPanelState {
  return silentlyFail(() => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  }, {});
}

export function persistPanelState() {
  return silentlyFail(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pos: panelPos.value, size: panelSize.value }));
  });
}

export const filteredVars = computed(
  () => {
    const query = searchQuery.value.trim().toLowerCase();
    const all = [...colorVars.value.values()];
    return query ? all.filter((v) => v.name.toLowerCase().includes(query)) : all;
  },
  { name: "filteredVars" }
);

export function refreshColorVars() {
  const scanned = scanColorVars();
  const merged = new Map<string, CSSColorVar>();
  for (const [name, scannedVar] of scanned) {
    const existing = colorVars.value.get(name);
    merged.set(
      name,
      existing
        ? {
            ...existing,
            variants: scannedVar.variants,
            count: scannedVar.count,
            activeVariant: scannedVar.activeVariant
          }
        : scannedVar
    );
  }
  for (const [name, v] of colorVars.value) {
    if (v.modified && !merged.has(name)) merged.set(name, v);
  }
  colorVars.value = merged;
}

export function setColorVar(name: string, newValue: string) {
  const current = colorVars.value.get(name);
  if (!current) return;
  document.documentElement.style.setProperty(name, newValue);
  colorVars.value = new Map(colorVars.value).set(name, {
    ...current,
    value: newValue,
    modified: newValue !== current.original
  });
}

export function resetColorVar(name: string) {
  const current = colorVars.value.get(name);
  if (!current) return;
  document.documentElement.style.removeProperty(name);
  colorVars.value = new Map(colorVars.value).set(name, {
    ...current,
    value: current.original,
    modified: false
  });
}

export function resetAll() {
  const next = new Map(colorVars.value);
  for (const [name, v] of next) {
    if (!v.modified) continue;
    document.documentElement.style.removeProperty(name);
    next.set(name, { ...v, value: v.original, modified: false });
  }
  colorVars.value = next;
}

export function showToast(message: string) {
  toast.value = message;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (toast.value = null), TOAST_DURATION);
}

export async function copyText(text: string, confirmation: string) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(confirmation);
  } catch {
    showToast("Copy failed — clipboard unavailable");
  }
}

export function exportAsCss(): string {
  const lines = [...colorVars.value.values()].map((v) => `  ${v.name}: ${toFormat(v.value, format.value)};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

export function exportAsJson(): string {
  const entries = [...colorVars.value.values()].map((v) => [v.name, toFormat(v.value, format.value)]);
  return JSON.stringify(Object.fromEntries(entries), null, 2);
}

const saved = getPanelState();

export const colorVars = signal<Map<string, CSSColorVar>>(new Map());
export const searchQuery = signal("");
export const format = signal<ColorFormat>("hex");
export const panelOpen = signal(true);
export const minimized = signal(false);
export const contrastOpen = signal(false);
export const toast = signal<string | null>(null);
export const activePicker = signal<{ name: string; x: number; y: number } | null>(null);
export const panelPos = signal(saved.pos ?? { x: PANEL_X, y: PANEL_Y });
export const panelSize = signal(saved.size ?? { w: PANEL_WIDTH, h: PANEL_HEIGHT });

colorVars.name = "colorVars";
searchQuery.name = "searchQuery";
format.name = "format";
panelOpen.name = "panelOpen";
minimized.name = "minimized";
contrastOpen.name = "contrastOpen";
toast.name = "toast";
activePicker.name = "activePicker";
panelPos.name = "panelPos";
panelSize.name = "panelSize";

export const groups = computed<Group[]>(
  () => {
    const byLabel = new Map<string, CSSColorVar[]>();
    for (const v of filteredVars.value) {
      const prefix = GROUP_PREFIXES.find((p) => v.name === p || v.name.startsWith(`${p}-`));
      const label = prefix ? `${prefix}-*` : OTHER_LABEL;
      const bucket = byLabel.get(label) ?? [];
      bucket.push(v);
      byLabel.set(label, bucket);
    }

    const order = [...GROUP_PREFIXES.map((p) => `${p}-*`), OTHER_LABEL];
    return order
      .filter((label) => byLabel.has(label))
      .map((label) => {
        const vars = byLabel.get(label)!;
        return {
          label,
          vars,
          modifiedCount: vars.filter((v) => v.modified).length
        };
      });
  },
  { name: "groups" }
);

export const modifiedCount = computed(() => [...colorVars.value.values()].filter((v) => v.modified).length, {
  name: "modifiedCount"
});
export const colorCount = computed(() => colorVars.value.size, { name: "colorCount" });
