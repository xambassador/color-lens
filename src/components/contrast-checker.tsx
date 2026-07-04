import { useState } from "preact/hooks";

import { colorVars, contrastOpen } from "../store";
import { contrastRatio, wcagLevel } from "../utils";

// https://www.w3.org/TR/WCAG21/#contrast-minimum
// https://www.w3.org/TR/WCAG21/#non-text-contrast
const CHECKS = [
  { label: "Normal text", aa: 4.5, aaa: 7 },
  { label: "Large text", aa: 3, aaa: 4.5 },
  { label: "UI components", aa: 3, aaa: null }
];

function Slot({
  label,
  value,
  swatch,
  names,
  onChange
}: {
  label: string;
  value: string;
  swatch: string;
  names: string[];
  onChange: (name: string) => void;
}) {
  return (
    <label class="contrast-slot">
      <span class="contrast-slot-label">{label}</span>
      <span class="swatch">
        <span class="swatch-fill" style={{ background: swatch }} />
      </span>
      <select value={value} onChange={(e) => onChange((e.target as HTMLSelectElement).value)}>
        {names.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ContrastChecker() {
  const names = [...colorVars.value.keys()];
  const [fg, setFg] = useState(names[0] ?? "");
  const [bg, setBg] = useState(names[1] ?? names[0] ?? "");

  const fgVar = colorVars.value.get(fg);
  const bgVar = colorVars.value.get(bg);

  if (!contrastOpen.value) return null;
  if (!fgVar || !bgVar) {
    return <div class="empty">Need at least two color variables to compare.</div>;
  }

  const ratio = contrastRatio(fgVar.value, bgVar.value);
  const level = wcagLevel(ratio);

  return (
    <div class="contrast">
      <Slot label="Text" value={fg} swatch={fgVar.value} names={names} onChange={setFg} />
      <Slot label="Back" value={bg} swatch={bgVar.value} names={names} onChange={setBg} />

      <div class="contrast-preview" style={{ color: fgVar.value, background: bgVar.value }}>
        <span class="contrast-preview-lg">Aa</span> The quick brown fox
      </div>

      <div class="contrast-ratio">
        <strong>{ratio.toFixed(2)}</strong>&thinsp;:&thinsp;1
        <span class={`badge badge-${level}`}>{level === "fail" ? "Fail" : level}</span>
      </div>

      <table class="contrast-table">
        <tbody>
          {CHECKS.map((c) => (
            <tr key={c.label}>
              <td>{c.label}</td>
              <td>
                <span class={`badge badge-${ratio >= c.aa ? "AA" : "fail"}`}>AA {ratio >= c.aa ? "✓" : "✗"}</span>
              </td>
              <td>
                {c.aaa !== null && (
                  <span class={`badge badge-${ratio >= c.aaa ? "AAA" : "fail"}`}>AAA {ratio >= c.aaa ? "✓" : "✗"}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
