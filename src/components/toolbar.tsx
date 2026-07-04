import { contrastOpen, copyText, exportAsCss, exportAsJson, format, resetAll, searchQuery } from "../store";
import type { ColorFormat } from "../types";

export const FORMATS: ColorFormat[] = ["hex", "rgb", "hsl", "oklch", "hwb"];

export function Toolbar() {
  return (
    <div class="toolbar">
      <input
        class="search"
        type="search"
        placeholder="Filter variables…"
        value={searchQuery.value}
        onInput={(e) => (searchQuery.value = (e.target as HTMLInputElement).value)}
      />
      <div class="format-row">
        {FORMATS.map((f) => (
          <button
            key={f}
            class={`format-pill ${format.value === f ? "active" : ""}`}
            onClick={() => (format.value = f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div class="actions-row">
        <button
          class="action-btn"
          title="Copy a :root { } block of all current values"
          onClick={() => copyText(exportAsCss(), "CSS copied to clipboard")}
        >
          CSS
        </button>
        <button
          class="action-btn"
          title="Copy variables as a JSON object"
          onClick={() => copyText(exportAsJson(), "JSON copied to clipboard")}
        >
          JSON
        </button>
        <button class="action-btn" title="Revert all modified variables" onClick={resetAll}>
          Reset All
        </button>
        <button
          class={`action-btn ${contrastOpen.value ? "active" : ""}`}
          title="WCAG contrast checker"
          onClick={() => (contrastOpen.value = !contrastOpen.value)}
        >
          Contrast
        </button>
      </div>
    </div>
  );
}
