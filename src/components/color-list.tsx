import { useState } from "preact/hooks";

import { contrastOpen, groups, searchQuery } from "../store";
import { CSSColorVar } from "../types";
import { ColorItem } from "./color-item";

export function ColorList() {
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
        <Group key={g.label} vars={g.vars} label={g.label} modifiedCount={g.modifiedCount} />
      ))}
    </div>
  );
}

function Group({ vars, label, modifiedCount }: { label: string; modifiedCount: number; vars: CSSColorVar[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed(!collapsed);
  return (
    <section>
      <button class="group-header" onClick={toggle}>
        <span class={`chevron ${collapsed ? "" : "open"}`}>▸</span>
        <span class="group-label">{label}</span>
        <span class="group-meta">
          {modifiedCount > 0 && <em class="group-modified">{modifiedCount} modified</em>}
          {vars.length}
        </span>
      </button>
      {!collapsed && vars.map((v) => <ColorItem key={v.name} v={v} />)}
    </section>
  );
}
