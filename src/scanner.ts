import type { CSSColorVar } from "./types";
import { isColorValue } from "./utils";

type Accumulator = Map<string, { values: string[]; count: number }>;

function accumulateProp(out: Accumulator, prop: string, value: string) {
  const entry = out.get(prop) ?? { values: [], count: 0 };
  entry.count++;
  if (value && !entry.values.includes(value)) entry.values.push(value);
  out.set(prop, entry);
}

function collectFromRules(rules: CSSRuleList, out: Accumulator) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      for (let i = 0; i < rule.style.length; i++) {
        const prop = rule.style[i];
        if (!prop.startsWith("--")) return;
        accumulateProp(out, prop, rule.style.getPropertyValue(prop).trim());
      }
      continue;
    }

    if ("cssRules" in rule) {
      collectFromRules((rule as CSSGroupingRule).cssRules, out);
    }
  }
}

export function scanColorVars(): Map<string, CSSColorVar> {
  const declared: Accumulator = new Map();

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // Cross-origin stylesheets throw SecurityError on cssRules access
      continue;
    }
    collectFromRules(rules, declared);
  }

  const inline = document.documentElement.style;
  for (let i = 0; i < inline.length; i++) {
    const prop = inline[i];
    if (!prop.startsWith("--")) continue;
    accumulateProp(declared, prop, inline.getPropertyValue(prop).trim());
  }

  const result = new Map<string, CSSColorVar>();
  const computed = getComputedStyle(document.documentElement);

  for (const [name, entry] of declared) {
    const activeVariant = computed.getPropertyValue(name).trim();
    if (!isColorValue(activeVariant)) continue;

    const variants = entry.values.filter(isColorValue);
    if (!variants.includes(activeVariant)) variants.push(activeVariant);

    result.set(name, {
      name,
      value: activeVariant,
      original: activeVariant,
      modified: false,
      variants,
      count: entry.count,
      activeVariant
    });
  }

  return result;
}

export function watchForChanges(onUpdate: () => void): MutationObserver {
  let timer: number | undefined;
  const observer = new MutationObserver((mutations) => {
    const styleAffected = mutations.some((m) =>
      [...m.addedNodes, ...m.removedNodes].some((node) => node.nodeName === "STYLE" || node.nodeName === "LINK")
    );
    if (!styleAffected) return;
    clearTimeout(timer);
    timer = window.setTimeout(onUpdate, 100);
  });
  observer.observe(document.head, { childList: true, subtree: true });
  return observer;
}
