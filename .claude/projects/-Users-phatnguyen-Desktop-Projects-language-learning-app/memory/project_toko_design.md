---
name: Tokō design system implementation
description: Muji-inspired redesign — color tokens, fonts, sidebar — implemented April 2026
type: project
---

Full "Tokō" aesthetic redesign applied to the app.

**Why:** User requested a modern, original aesthetic — Asian stationery / Muji feel, not "vibe-coded". Design exported from claude.ai/design as a bundle.

**How to apply:** All Tokō tokens live as CSS custom properties prefixed `--tk-*` in `src/index.css`. They are also exposed as Tailwind utilities (`bg-paper`, `bg-matcha`, `text-ink-3`, etc.) via `tailwind.config.js`. shadcn HSL variables are remapped to the Tokō palette so existing shadcn components inherit the new theme automatically.

Key tokens:
- `--tk-paper` #FAF7F2 — main background (washi)
- `--tk-card` #FEFCF7 — card lift surface
- `--tk-accent` #3F5D4C — matcha green (primary accent)
- `--tk-persimmon` #C85C3C — error/streak accent only
- `--tk-ink` #1C1B17 — warm near-black

Fonts loaded in `index.html`: Instrument Serif (display), IBM Plex Mono (mono), Geist (body).

Sidebar: completely redesigned in `src/components/Sidebar.tsx` — "Tokō / reading room" wordmark, thin nav items, circular seal avatar motif, matcha active states.

CSS utility classes: `.tk-eyebrow`, `.tk-page-title`, `.tk-page-header`, `.tk-mono`, `.tk-display-*`, `.tk-seal`, `.tk-btn`, `.tk-card`, `.tk-input`, `.tk-chip`, `.tk-fade-up`.
