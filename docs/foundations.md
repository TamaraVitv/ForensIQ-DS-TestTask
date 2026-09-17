# Foundations

Generated from `build/source.json`. Do not edit — run `npm run docs`.

## Palette

Primitives are the raw ramp. They are deliberately hidden from the Figma property pickers: build against the semantic tokens in the next section, never against these.

### grey

| Token | Value | CSS |
| --- | --- | --- |
| `grey/06` | `#11110f` | `--grey-06` |
| `grey/11` | `#1c1c1a` | `--grey-11` |
| `grey/22` | `#3a3a34` | `--grey-22` |
| `grey/33` | `#55554e` | `--grey-33` |
| `grey/50` | `#7f7f75` | `--grey-50` |
| `grey/55` | `#8c8c84` | `--grey-55` |
| `grey/65` | `#a8a9a1` | `--grey-65` |
| `grey/76` | `#c2c2bc` | `--grey-76` |
| `grey/83` | `#d6d6d1` | `--grey-83` |
| `grey/85` | `#dcdcd7` | `--grey-85` |
| `grey/89` | `#e4e4df` | `--grey-89` |
| `grey/91` | `#eaeae8` | `--grey-91` |
| `grey/95` | `#f4f4f3` | `--grey-95` |
| `grey/97` | `#f7f7f5` | `--grey-97` |
| `grey/100` | `#ffffff` | `--grey-100` |

### ink

| Token | Value | CSS |
| --- | --- | --- |
| `ink/alpha-20` | `#12121233` | `--ink-alpha-20` |
| `ink/alpha-50` | `#12121280` | `--ink-alpha-50` |
| `ink/alpha-70` | `#121212b2` | `--ink-alpha-70` |

### white

| Token | Value | CSS |
| --- | --- | --- |
| `white/alpha-20` | `#ffffff33` | `--white-alpha-20` |

### lime

| Token | Value | CSS |
| --- | --- | --- |
| `lime/25` | `#3a4a12` | `--lime-25` |
| `lime/60` | `#b4cb52` | `--lime-60` |
| `lime/65` | `#b7e63b` | `--lime-65` |
| `lime/75` | `#d9ef71` | `--lime-75` |

### olive

| Token | Value | CSS |
| --- | --- | --- |
| `olive/25` | `#38402a` | `--olive-25` |
| `olive/45` | `#6e7a45` | `--olive-45` |
| `olive/55` | `#8a9467` | `--olive-55` |
| `olive/65` | `#9ca575` | `--olive-65` |
| `olive/70` | `#a9b088` | `--olive-70` |
| `olive/76` | `#c8cdb5` | `--olive-76` |
| `olive/78` | `#d6dac7` | `--olive-78` |
| `olive/80` | `#dadcc9` | `--olive-80` |
| `olive/85` | `#dfe3ce` | `--olive-85` |

### orange

| Token | Value | CSS |
| --- | --- | --- |
| `orange/20` | `#4a2102` | `--orange-20` |
| `orange/50` | `#f36704` | `--orange-50` |
| `orange/55` | `#ff5a00` | `--orange-55` |
| `orange/60` | `#ff6a00` | `--orange-60` |
| `orange/92` | `#fde3d0` | `--orange-92` |
| `orange/97` | `#fef4ec` | `--orange-97` |

### red

| Token | Value | CSS |
| --- | --- | --- |
| `red/20` | `#3d1410` | `--red-20` |
| `red/50` | `#c03a2b` | `--red-50` |
| `red/97` | `#fdf6f5` | `--red-97` |

## Semantic color

Every token resolves to a primitive per theme. Switch themes with `data-theme="dark"` on any ancestor, or let the OS decide via `prefers-color-scheme`.

### action

| Token | Light | Dark | CSS |
| --- | --- | --- | --- |
| `action/accent/default` | `olive/65` `#9ca575` | `olive/65` `#9ca575` | `--action-accent-default` |
| `action/accent/hover` | `olive/55` `#8a9467` | `olive/70` `#a9b088` | `--action-accent-hover` |
| `action/accent/text` | `grey/06` `#11110f` | `grey/06` `#11110f` | `--action-accent-text` |
| `action/brand/default` | `orange/50` `#f36704` | `orange/50` `#f36704` | `--action-brand-default` |
| `action/brand/hover` | `orange/55` `#ff5a00` | `orange/60` `#ff6a00` | `--action-brand-hover` |
| `action/brand/pressed` | `orange/60` `#ff6a00` | `orange/60` `#ff6a00` | `--action-brand-pressed` |
| `action/brand/text` | `grey/100` `#ffffff` | `grey/06` `#11110f` | `--action-brand-text` |
| `action/disabled/default` | `grey/91` `#eaeae8` | `grey/22` `#3a3a34` | `--action-disabled-default` |
| `action/disabled/text` | `grey/65` `#a8a9a1` | `grey/50` `#7f7f75` | `--action-disabled-text` |
| `action/primary/default` | `grey/06` `#11110f` | `grey/100` `#ffffff` | `--action-primary-default` |
| `action/primary/hover` | `grey/22` `#3a3a34` | `grey/85` `#dcdcd7` | `--action-primary-hover` |
| `action/primary/text` | `grey/100` `#ffffff` | `grey/06` `#11110f` | `--action-primary-text` |
| `action/secondary/default` | `grey/100` `#ffffff` | `grey/22` `#3a3a34` | `--action-secondary-default` |
| `action/secondary/hover` | `grey/95` `#f4f4f3` | `grey/33` `#55554e` | `--action-secondary-hover` |
| `action/secondary/text` | `grey/06` `#11110f` | `grey/95` `#f4f4f3` | `--action-secondary-text` |

### bg

| Token | Light | Dark | CSS |
| --- | --- | --- | --- |
| `bg/emphasis` | `grey/11` `#1c1c1a` | `grey/06` `#11110f` | `--bg-emphasis` |
| `bg/hover` | `grey/97` `#f7f7f5` | `grey/22` `#3a3a34` | `--bg-hover` |
| `bg/inverse` | `grey/06` `#11110f` | `grey/100` `#ffffff` | `--bg-inverse` |
| `bg/muted` | `grey/91` `#eaeae8` | `grey/22` `#3a3a34` | `--bg-muted` |
| `bg/page` | `grey/100` `#ffffff` | `grey/06` `#11110f` | `--bg-page` |
| `bg/subtle` | `grey/95` `#f4f4f3` | `grey/11` `#1c1c1a` | `--bg-subtle` |

### border

| Token | Light | Dark | CSS |
| --- | --- | --- | --- |
| `border/accent` | `olive/55` `#8a9467` | `olive/70` `#a9b088` | `--border-accent` |
| `border/brand` | `orange/50` `#f36704` | `orange/55` `#ff5a00` | `--border-brand` |
| `border/default` | `grey/85` `#dcdcd7` | `grey/33` `#55554e` | `--border-default` |
| `border/faint` | `grey/95` `#f4f4f3` | `grey/11` `#1c1c1a` | `--border-faint` |
| `border/focus` | `orange/50` `#f36704` | `orange/55` `#ff5a00` | `--border-focus` |
| `border/inverse` | `grey/06` `#11110f` | `grey/100` `#ffffff` | `--border-inverse` |
| `border/on-inverse` | `grey/100` `#ffffff` | `grey/06` `#11110f` | `--border-on-inverse` |
| `border/strong` | `grey/65` `#a8a9a1` | `grey/50` `#7f7f75` | `--border-strong` |
| `border/subtle` | `grey/91` `#eaeae8` | `grey/22` `#3a3a34` | `--border-subtle` |

### divider

| Token | Light | Dark | CSS |
| --- | --- | --- | --- |
| `divider/default` | `grey/83` `#d6d6d1` | `grey/33` `#55554e` | `--divider-default` |
| `divider/strong` | `grey/65` `#a8a9a1` | `grey/50` `#7f7f75` | `--divider-strong` |
| `divider/subtle` | `grey/89` `#e4e4df` | `grey/22` `#3a3a34` | `--divider-subtle` |

### feedback

| Token | Light | Dark | CSS |
| --- | --- | --- | --- |
| `feedback/danger/bg` | `red/97` `#fdf6f5` | `red/20` `#3d1410` | `--feedback-danger-bg` |
| `feedback/danger/fg` | `red/50` `#c03a2b` | `red/50` `#c03a2b` | `--feedback-danger-fg` |
| `feedback/highlight/bg` | `lime/65` `#b7e63b` | `lime/65` `#b7e63b` | `--feedback-highlight-bg` |
| `feedback/highlight/fg` | `grey/06` `#11110f` | `grey/06` `#11110f` | `--feedback-highlight-fg` |
| `feedback/success/bg` | `olive/85` `#dfe3ce` | `olive/25` `#38402a` | `--feedback-success-bg` |
| `feedback/success/fg` | `olive/45` `#6e7a45` | `lime/60` `#b4cb52` | `--feedback-success-fg` |

### overlay

| Token | Light | Dark | CSS |
| --- | --- | --- | --- |
| `overlay/hairline` | `ink/alpha-20` `#12121233` | `white/alpha-20` `#ffffff33` | `--overlay-hairline` |
| `overlay/scrim` | `ink/alpha-70` `#121212b2` | `ink/alpha-70` `#121212b2` | `--overlay-scrim` |
| `overlay/scrim-soft` | `ink/alpha-50` `#12121280` | `ink/alpha-50` `#12121280` | `--overlay-scrim-soft` |

### surface

| Token | Light | Dark | CSS |
| --- | --- | --- | --- |
| `surface/accent-subtle` | `olive/85` `#dfe3ce` | `olive/25` `#38402a` | `--surface-accent-subtle` |
| `surface/brand-subtle` | `orange/97` `#fef4ec` | `orange/20` `#4a2102` | `--surface-brand-subtle` |
| `surface/default` | `grey/100` `#ffffff` | `grey/11` `#1c1c1a` | `--surface-default` |
| `surface/raised` | `grey/97` `#f7f7f5` | `grey/22` `#3a3a34` | `--surface-raised` |
| `surface/subtle` | `grey/95` `#f4f4f3` | `grey/11` `#1c1c1a` | `--surface-subtle` |

### text

| Token | Light | Dark | CSS |
| --- | --- | --- | --- |
| `text/accent` | `olive/45` `#6e7a45` | `olive/70` `#a9b088` | `--text-accent` |
| `text/body` | `grey/22` `#3a3a34` | `grey/85` `#dcdcd7` | `--text-body` |
| `text/brand` | `orange/50` `#f36704` | `orange/55` `#ff5a00` | `--text-brand` |
| `text/danger` | `red/50` `#c03a2b` | `red/50` `#c03a2b` | `--text-danger` |
| `text/disabled` | `grey/65` `#a8a9a1` | `grey/33` `#55554e` | `--text-disabled` |
| `text/inverse` | `grey/100` `#ffffff` | `grey/06` `#11110f` | `--text-inverse` |
| `text/primary` | `grey/06` `#11110f` | `grey/95` `#f4f4f3` | `--text-primary` |
| `text/secondary` | `grey/33` `#55554e` | `grey/65` `#a8a9a1` | `--text-secondary` |
| `text/tertiary` | `grey/50` `#7f7f75` | `grey/55` `#8c8c84` | `--text-tertiary` |

## Spacing

A 4pt-based scale with one deliberate exception at `10`, which appears often enough in the source design to earn a step. The design was snapped onto this scale — see `docs/audit.md` for what moved.

| Token | Value | CSS |
| --- | --- | --- |
| `spacing/0` | 0px | `--spacing-0` |
| `spacing/2` | 2px | `--spacing-2` |
| `spacing/4` | 4px | `--spacing-4` |
| `spacing/6` | 6px | `--spacing-6` |
| `spacing/8` | 8px | `--spacing-8` |
| `spacing/10` | 10px | `--spacing-10` |
| `spacing/12` | 12px | `--spacing-12` |
| `spacing/16` | 16px | `--spacing-16` |
| `spacing/20` | 20px | `--spacing-20` |
| `spacing/24` | 24px | `--spacing-24` |
| `spacing/32` | 32px | `--spacing-32` |
| `spacing/40` | 40px | `--spacing-40` |
| `spacing/48` | 48px | `--spacing-48` |
| `spacing/64` | 64px | `--spacing-64` |
| `spacing/80` | 80px | `--spacing-80` |
| `spacing/96` | 96px | `--spacing-96` |
| `spacing/128` | 128px | `--spacing-128` |
| `spacing/160` | 160px | `--spacing-160` |

### Role tokens

Prefer these where a role exists — they are the ones that change when the system rethinks its rhythm.

| Token | Value | CSS |
| --- | --- | --- |
| `spacing/card/gap` | 12px | `--spacing-card-gap` |
| `spacing/card/padding` | 24px | `--spacing-card-padding` |
| `spacing/control/gap` | 8px | `--spacing-control-gap` |
| `spacing/control/padding-x-md` | 16px | `--spacing-control-padding-x-md` |
| `spacing/control/padding-x-sm` | 12px | `--spacing-control-padding-x-sm` |
| `spacing/control/padding-y-md` | 10px | `--spacing-control-padding-y-md` |
| `spacing/control/padding-y-sm` | 6px | `--spacing-control-padding-y-sm` |
| `spacing/layout/gutter` | 32px | `--spacing-layout-gutter` |
| `spacing/section/gap` | 48px | `--spacing-section-gap` |
| `spacing/section/padding-x` | 96px | `--spacing-section-padding-x` |
| `spacing/section/padding-y` | 96px | `--spacing-section-padding-y` |

## Radius

The product is mostly square-cornered by design — radii are used sparingly.

| Token | Value | CSS |
| --- | --- | --- |
| `radius/none` | 0px | `--radius-none` |
| `radius/xs` | 2px | `--radius-xs` |
| `radius/sm` | 4px | `--radius-sm` |
| `radius/md` | 5px | `--radius-md` |
| `radius/lg` | 8px | `--radius-lg` |
| `radius/full` | 9999px (pill) | `--radius-full` |

## Border width

| Token | Value | CSS |
| --- | --- | --- |
| `border-width/hairline` | 0.5px | `--border-width-hairline` |
| `border-width/default` | 1px | `--border-width-default` |
| `border-width/strong` | 2px | `--border-width-strong` |

## Sizing

Control heights and icon boxes.

| Token | Value | CSS |
| --- | --- | --- |
| `size/control/sm` | 32px | `--size-control-sm` |
| `size/control/md` | 40px | `--size-control-md` |
| `size/control/lg` | 48px | `--size-control-lg` |
| `size/icon/sm` | 16px | `--size-icon-sm` |
| `size/icon/md` | 20px | `--size-icon-md` |
| `size/icon/lg` | 24px | `--size-icon-lg` |

## Type

Two families: Inter for everything readable, IBM Plex Mono for labels, eyebrows and buttons — always uppercase with wide tracking.

| Figma style | CSS class | Family | Weight | Size | Line height | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| `H/H1` | `.type-heading-1` | sans | medium | 64px | auto (1.2) | 0 |
| `H/H2` | `.type-heading-2` | sans | medium | 40px | auto (1.2) | 0 |
| `H/H3` | `.type-heading-3` | sans | medium | 24px | 32px | 0 |
| `H/H4` | `.type-heading-4` | sans | medium | 18px | 25px | 0 |
| `P/P1` | `.type-body-lg` | sans | regular | 18px | 30px | 0 |
| `P/P2` | `.type-body-md` | sans | regular | 16px | 28px | 0 |
| `14 R` | `.type-body-sm` | sans | regular | 14px | 20px | 0 |
| `P/12 R` | `.type-caption` | sans | regular | 12px | 18px | 0 |
| `P/Label` | `.type-label` | mono | regular | 12px | auto (1.2) | 1.1px |
| `P/12 M` | `.type-label-strong` | mono | medium | 12px | auto (1.2) | 1.1px |
| `Button/12 M` | `.type-button-sm` | mono | medium | 12px | auto (1.2) | 1.1px |
| `Button/16 M` | `.type-button-md` | mono | medium | 16px | auto (1.2) | 1.1px |

## Elevation

| Token | Value |
| --- | --- |
| `elevation-xs` | `0 1px 2px 0 #11110f0f` |
| `elevation-sm` | `0 4px 8px 0 #0000000d` |
| `elevation-md` | `0 8px 24px 0 #11110f14` |
| `elevation-lg` | `0 16px 40px 0 #11110f1a` |
| `glow-brand` | `0 2px 16px 0 #f3670433` |
