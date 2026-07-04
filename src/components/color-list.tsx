import { useState } from "preact/hooks";

import { contrastOpen, groups, searchQuery } from "../store";
import { ColorItem } from "./color-item";

export function ColorList() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (label: string) => setCollapsed((c) => ({ ...c, [label]: !c[label] }));

  if (contrastOpen.value) return null;

  if (groups.value.length === 0) {
    return (
      <div class="empty">
        {searchQuery.value ? "No variables match your search" : "No CSS color variables found on this page"}
      </div>
    );
  }

  return (
    <div class="color-list">
      {groups.value.map((g) => (
        <section key={g.label}>
          <button class="group-header" onClick={() => toggle(g.label)}>
            <span class={`chevron ${collapsed[g.label] ? "" : "open"}`}>▸</span>
            <span class="group-label">{g.label}</span>
            <span class="group-meta">
              {g.modifiedCount > 0 && <em class="group-modified">{g.modifiedCount} modified</em>}
              {g.vars.length}
            </span>
          </button>
          {!collapsed[g.label] && g.vars.map((v) => <ColorItem key={v.name} v={v} />)}
        </section>
      ))}
    </div>
  );
}
