import { h, render } from "preact";

import { App } from "./components/app";
import { panelOpen, resetAll } from "./store";

import styles from "./styles/main.css?inline";

const HOST_ID = "__colorlens__";

function init() {
  if (document.getElementById(HOST_ID)) return;

  const host = document.createElement("div");
  host.id = HOST_ID;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = styles;
  shadow.appendChild(style);

  const root = document.createElement("div");
  shadow.appendChild(root);
  render(h(App, null), root);

  window.__colorlens__ = {
    show: () => (panelOpen.value = true),
    hide: () => (panelOpen.value = false),
    reset: resetAll
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
