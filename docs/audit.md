# Audit

What the tokenisation found in the source Figma file, what was changed, and what is still open. Written against `Landing V2` (6,972 nodes) in `xGgxvE8ek2RhP7QsPxSDTR`.

## Starting state

The file had 12 paint styles and 16 text styles and **no variables at all**. Naming conventions already in use (`Grey/85`, `Accent/1`, `H/H1`, `P/P1`) were carried into the primitive layer rather than replaced.

## Coverage

| | Bound to tokens |
| --- | --- |
| Fills | 289 |
| Strokes | 127 |
| Padding / gap / radius | 767 |

Colour drift after rebinding: **0**. Every bound paint resolves to exactly the value it had before, so light mode renders identically to the original.

## Changes made to the design

### Off-palette text normalised (34 layers)

These sat outside the palette and broke dark mode — a hardcoded `#000000` heading stays black when the background inverts.

| Was | Now | Layers | Delta |
| --- | --- | --- | --- |
| `#000000` | `text/primary` `#11110f` | 25 | 1–17/255 |
| `#f7f7f5` | `text/inverse` `#ffffff` | 3 | 8/255 |
| `#333333` | `text/body` `#3a3a34` | 3 | 1–7/255 |
| `#8c8c84` | `text/tertiary` `#7f7f75` | 2 | 13/255 |
| `#3a3a34` | `text/body` | 1 | 0 |

### Spacing snapped to the scale (156 properties)

The source design used 30+ distinct spacing values. Everything off-scale was snapped to the nearest step, ties rounding down.

| Was | Now | Count |
| --- | --- | --- |
| 14 | 12 | 39 |
| 18 | 16 | 36 |
| 108 | 96 | 20 |
| 60 | 64 | 20 |
| 28 | 24 | 8 |
| 36 | 32 | 8 |
| 68 | 64 | 7 |
| 102 | 96 | 4 |
| 180 | 160 | 2 |
| 53 | 48 | 2 |
| 100 | 96 | 2 |
| 17 | 16 | 2 |
| 120 | 128 | 2 |
| 56 | 48 | 1 |
| 135 | 128 | 1 |
| 43 | 40 | 1 |
| 29 | 32 | 1 |

Net effect on the desktop page: **5,368px → 5,256px**, about 2% shorter. Section rhythm and hierarchy unchanged.

### Naming

The semantic spacing scale was renamed from t-shirt sizes to numeric (`spacing/md` → `spacing/12`). With values like 14 sitting exactly between `md` and `lg`, t-shirt naming gave no principled answer to where they should snap. Role tokens (`spacing/control/*`, `spacing/card/*`, `spacing/section/*`) kept semantic names, which is where they earn their keep.

`color/surface/sunken` became `color/surface/subtle`. "Sunken" is incoherent in dark mode, where the page is already the darkest surface and anything distinct from it must be *lighter*.

## Open issues

### Contrast

Eleven text/background pairs fall below WCAG AA 4.5:1. `npm run validate` prints the current list on every build.

The one that matters: **`text/brand` (`#f36704`) on `bg/subtle` is 2.83:1** — it fails AA even for large text. The brand orange is safe as a fill behind white text, and as large display type on white (3.11:1 clears AA for large text only). It should not be used for body copy on any background. Fixing this properly means darkening the orange for text use — a brand decision, so it has not been made here.

`text/tertiary` and `text/accent` clear AA for large text but not for body copy.

### Dark mode

Dark values are **derived, not designed**. They were inferred from the light palette and need a designer's eye before shipping. Four primitives exist only to serve dark mode and appear nowhere in the light design: `orange/20`, `olive/25`, `red/20`, `lime/25`.

Known gaps in the Figma file:

- The `Header` component's main component lives on another page and was not rebound, so the header does not invert.
- Card and hero artwork are illustration compositions rather than real UI. They were deliberately left untokenised — illustrations should not inherit semantic colours.

### Untokenised by design

`#000000` on ~1,750 illustration vectors, plus one-off tints (`#f5f5f2`, `#e4e4df`, `#eaebe5`, `#d5d5c9`) that appear only inside decorative compositions. These are artwork, not interface.

### Leftovers

Four text styles named `P/P3_test` … `P/P6_test` remain unbound in Figma. They look like experiments that were never cleaned up.
