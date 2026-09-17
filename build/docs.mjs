#!/usr/bin/env node
/** Generates docs/foundations.md from source.json so the reference can never drift from the tokens. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = JSON.parse(readFileSync(join(root, 'build/source.json'), 'utf8'));
const prim = new Map(src.primitives.map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const cssVar = (n) => '`--' + n.replace(/\//g, '-') + '`';
const swatch = (hex) => `\`${hex}\``;

const o = [];
o.push('# Foundations');
o.push('');
o.push('Generated from `build/source.json`. Do not edit — run `npm run docs`.');
o.push('');
o.push('## Palette');
o.push('');
o.push('Primitives are the raw ramp. They are deliberately hidden from the Figma property pickers: build against the semantic tokens in the next section, never against these.');
o.push('');
const ramps = {};
for (const [n, v] of prim) {
  if (!v.startsWith('#')) continue;
  const [group] = n.split('/');
  (ramps[group] ??= []).push([n, v]);
}
for (const [group, entries] of Object.entries(ramps)) {
  o.push(`### ${group}`);
  o.push('');
  o.push('| Token | Value | CSS |');
  o.push('| --- | --- | --- |');
  for (const [n, v] of entries) o.push(`| \`${n}\` | ${swatch(v)} | ${cssVar(n)} |`);
  o.push('');
}

o.push('## Semantic color');
o.push('');
o.push('Every token resolves to a primitive per theme. Switch themes with `data-theme="dark"` on any ancestor, or let the OS decide via `prefers-color-scheme`.');
o.push('');
const groups = {};
for (const line of src.color) {
  const [name, l, d] = line.split('|');
  (groups[name.split('/')[0]] ??= []).push([name, l, d]);
}
for (const [group, entries] of Object.entries(groups)) {
  o.push(`### ${group}`);
  o.push('');
  o.push('| Token | Light | Dark | CSS |');
  o.push('| --- | --- | --- | --- |');
  for (const [n, l, d] of entries) {
    o.push(`| \`${n}\` | \`${l}\` ${swatch(prim.get(l))} | \`${d}\` ${swatch(prim.get(d))} | ${cssVar(n)} |`);
  }
  o.push('');
}

o.push('## Spacing');
o.push('');
o.push('A 4pt-based scale with one deliberate exception at `10`, which appears often enough in the source design to earn a step. The design was snapped onto this scale — see `docs/audit.md` for what moved.');
o.push('');
o.push('| Token | Value | CSS |');
o.push('| --- | --- | --- |');
for (const line of src.spacing) {
  const [n, a] = line.split('|');
  if (!n.startsWith('spacing/') || n.split('/').length > 2) continue;
  o.push(`| \`${n}\` | ${prim.get(a)}px | ${cssVar(n)} |`);
}
o.push('');
o.push('### Role tokens');
o.push('');
o.push('Prefer these where a role exists — they are the ones that change when the system rethinks its rhythm.');
o.push('');
o.push('| Token | Value | CSS |');
o.push('| --- | --- | --- |');
for (const line of src.spacing) {
  const [n, a] = line.split('|');
  if (!n.startsWith('spacing/') || n.split('/').length === 2) continue;
  o.push(`| \`${n}\` | ${prim.get(a)}px | ${cssVar(n)} |`);
}
o.push('');

for (const [title, prefix, note] of [
  ['Radius', 'radius/', 'The product is mostly square-cornered by design — radii are used sparingly.'],
  ['Border width', 'border-width/', null],
  ['Sizing', 'size/', 'Control heights and icon boxes.'],
]) {
  o.push(`## ${title}`);
  o.push('');
  if (note) { o.push(note); o.push(''); }
  o.push('| Token | Value | CSS |');
  o.push('| --- | --- | --- |');
  for (const line of src.spacing) {
    const [n, a] = line.split('|');
    if (!n.startsWith(prefix)) continue;
    const v = prim.get(a);
    o.push(`| \`${n}\` | ${n === 'radius/full' ? '9999px (pill)' : v + 'px'} | ${cssVar(n)} |`);
  }
  o.push('');
}

o.push('## Type');
o.push('');
o.push('Two families: Inter for everything readable, IBM Plex Mono for labels, eyebrows and buttons — always uppercase with wide tracking.');
o.push('');
o.push('| Figma style | CSS class | Family | Weight | Size | Line height | Tracking |');
o.push('| --- | --- | --- | --- | --- | --- | --- |');
for (const t of src.textStyles) {
  const size = prim.get(src.typography.find((l) => l.startsWith(`font/size/${t.size}|`)).split('|')[1]);
  const lh = t.lineHeight
    ? prim.get(src.typography.find((l) => l.startsWith(`font/line-height/${t.lineHeight}|`)).split('|')[1]) + 'px'
    : 'auto (1.2)';
  const ls = t.letterSpacing === 'wide' ? '1.1px' : '0';
  o.push(`| \`${t.name}\` | \`.type-${t.css}\` | ${t.family} | ${t.weight} | ${size}px | ${lh} | ${ls} |`);
}
o.push('');

o.push('## Elevation');
o.push('');
o.push('| Token | Value |');
o.push('| --- | --- |');
for (const s of src.shadows) o.push(`| \`${s.name}\` | \`${s.value}\` |`);
o.push('');

mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs/foundations.md'), o.join('\n'));
console.log('wrote docs/foundations.md');
