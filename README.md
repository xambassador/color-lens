# Color lens

**Inspect, edit, and export your page's CSS custom variables in real time. No build step, no browser extension, no page reloads.**

I am not a designer, so most of the time I don’t have any designs in Figma or anything else for quick prototyping or my personal projects. I use sites like [Color hunt](https://colorhunt.co) or [Coolors](https://coolors.co) to pick a color, then use tools like [oklch coverter](https://oklch.com) or [convert a color](https://convertacolor.com/) to convert it to a format that I use in my projects. To reduce the friction of this process and rather than spending time on designing just to see how a color looks in my project, I created color lens which is a throwaway tool; once colors are set, just remove the script tag.

## Installation

Drop one script tag in your page and start using it.

```html
<script crossorigin="anonymous" src="https://unpkg.com/color-lens@latest/dist/color-lens.iife.js"></script>
```

That's it!

## Features

- **Zero install** - a single self-contained script (~23 KB gzipped)
- **Fully isolated** - uses shadow DOM to prevent breaking application's style
- **Framework agnostic** — works on any site: React, Vue, plain HTML, WordPress, anything with CSS variables
- **Real-time editing** - edit your CSS variables in real time and see the changes immediately
- **Export** - copy as CSS or JSON

## Programmatic API

Color lens inject a global variable call `__colorlens__` with three methods attach to it: `show`, `hide` and `reset`.

```js
window.__colorlens__.show();
window.__colorlens__.hide();
window.__colorlens__.reset();
```
