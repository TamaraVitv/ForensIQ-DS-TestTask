# ForensIQ Design System

Design tokens for the ForensIQ product, extracted from the Figma source of truth and published as CSS, TypeScript, Tailwind and W3C-standard JSON.

Every value here came out of the design file — nothing was invented to fill a gap, with one flagged exception: the dark theme is derived rather than designed. See [`docs/audit.md`](docs/audit.md).

## Install

```bash
npm install
npm test        # build + validate
```

## Use it

### CSS

```css
@import '@forensiq/design-system/tokens.css';

.card {
  background: var(--surface-default);
  border: var(--border-width-default) solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--spacing-card-padding);
  box-shadow: var(--shadow-elevation-sm);
}
```

Type styles ship as utility classes:

```html
<h1 class="type-heading-1">One platform to analyse all evidence</h1>
<span class="type-label">Case summary</span>
```

### Dark theme

Semantic colors are theme-aware. Nothing else needs to change:

```html
<html data-theme="dark">
```

Without an explicit `data-theme`, the system follows `prefers-color-scheme`. Set `data-theme="light"` to pin light regardless of OS.

### Tailwind

```js
// tailwind.config.js
import forensiq from '@forensiq/design-system/tailwind';
export default { presets: [forensiq], content: ['./src/**/*.{ts,tsx}'] };
```

```html
<button class="bg-action-brand-default text-action-brand-text px-control-padding-x-md rounded-md">
```

Colors resolve through CSS variables, so the Tailwind classes follow the active theme automatically.

### TypeScript

```ts
import { color, spacing, colorVar } from '@forensiq/design-system/tokens';

color.light['text/primary']; // '#11110f'
color.dark['text/primary'];  // '#f4f4f3'
spacing['spacing/24'];       // 24
colorVar('surface/default'); // 'var(--surface-default)'
```

Use `colorVar()` in anything rendered — it stays theme-aware. The resolved hexes are for canvas, charts, emails and other contexts that cannot read CSS variables.

## Token architecture

Three layers. Components bind to the semantic layer; nothing should reference a primitive directly.

```
Primitives        grey/06, orange/50, space/24, font-size/64
  ↓ aliased by
Semantic          text/primary, action/brand/default, spacing/24, font/size/h1
  ↓ consumed by
Components        button, card, input
```

| Collection | Modes | Tokens |
| --- | --- | --- |
| Primitives | Value | 93 |
| Color | Light, Dark | 56 |
| Spacing & Radius | Value | 44 |
| Typography | Value | 24 |

Primitives are scoped out of the Figma property pickers on purpose. If a primitive is what you need, the semantic layer is missing a token — add it there.

## Repository layout

```
build/source.json       exported from Figma; the single source of truth
build/build.mjs         source.json → dist/
build/docs.mjs          source.json → docs/foundations.md
build/validate.mjs      structural checks + contrast report
tokens/*.json           W3C DTCG format; color ships as color.light.json + color.dark.json
dist/tokens.css         custom properties, type styles, light + dark
dist/tokens.ts          typed constants
dist/tailwind.preset.js Tailwind preset
docs/foundations.md     generated reference
docs/audit.md           findings, changes, open issues
```

Everything under `dist/` and `docs/foundations.md` is generated. Edit `build/source.json` (or re-export from Figma) and run `npm test`.

## Updating from Figma

1. Re-export the variable collections from the Figma file into `build/source.json`.
2. `npm test` — regenerates `dist/`, then checks that every `var()` resolves, that light and dark declare the same token set, and that no semantic token points at a missing primitive.
3. `npm run docs` to refresh the generated reference.

## Known issues

`text/brand` (`#f36704`) is **2.83:1** on `bg/subtle` — below WCAG AA even for large text. Safe as a fill behind white text; not safe for body copy. The dark theme is derived and wants a designer's review before it ships. Both are detailed in [`docs/audit.md`](docs/audit.md).

## Source

Figma — `Tamara Test task for ForensIQ`, page `Landing V2`.
