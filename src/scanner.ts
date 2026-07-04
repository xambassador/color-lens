import type { CSSColorVar } from "./types";
import { isColorValue } from "./utils";

function collectFromRules(rules: CSSRuleList, out: Map<string, string>) {
  for (const rule of Array.from(rules)) {
    if (rule instanceof CSSStyleRule) {
      for (let i = 0; i < rule.style.length; i++) {
        const prop = rule.style[i];
        if (prop.startsWith("--")) {
          out.set(prop, rule.style.getPropertyValue(prop));
        }
      }
    } else if ("cssRules" in rule) {
      collectFromRules((rule as CSSGroupingRule).cssRules, out);
    }
  }
}

export function scanColorVars(): Map<string, CSSColorVar> {
  const declared = new Map<string, string>();

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

  // Inline styles if contains any custom properties
  const inline = document.documentElement.style;
  for (let i = 0; i < inline.length; i++) {
    const prop = inline[i];
    if (prop.startsWith("--")) {
      declared.set(prop, inline.getPropertyValue(prop));
    }
  }

  const result = new Map<string, CSSColorVar>();
  const computed = getComputedStyle(document.documentElement);

  for (const [name, raw] of declared) {
    let value = raw.trim();
    if (!isColorValue(value)) {
      // value may refernce another variable
      value = computed.getPropertyValue(name).trim();
      if (!isColorValue(value)) continue;
    }
    result.set(name, { name, value, original: value, modified: false });
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
