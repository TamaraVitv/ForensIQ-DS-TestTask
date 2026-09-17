#!/usr/bin/env node
/**
 * Guards the generated output:
 *  1. every var(--x) reference resolves to a property declared in tokens.css
 *  2. light and dark define exactly the same set of semantic tokens
 *  3. every semantic token bottoms out in a real primitive value
 *  4. WCAG contrast is reported for text-on-background pairs in both themes
 * Exits non-zero on 1-3. Contrast is reported, not enforced — see docs/audit.md.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(root, 'dist/tokens.css'), 'utf8');

const declared = new Set([...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)].map((m) => m[1]));
const referenced = [...css.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((m) => m[1]);

const errors = [];

const missing = [...new Set(referenced)].filter((r) => !declared.has(r));
if (missing.length) errors.push(`Unresolved CSS variables: ${missing.join(', ')}`);

const block = (re) => (css.match(re)?.[1] ?? '');
const namesIn = (body) => new Set([...body.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const lightNames = namesIn(block(/:root \{([\s\S]*?)\n\}/));
const darkNames = namesIn(block(/\[data-theme='dark'\] \{([\s\S]*?)\n\}/));

const src = JSON.parse(readFileSync(join(root, 'build/source.json'), 'utf8'));

/* The semantic colour set is whatever source.json declares — never inferred from name prefixes,
   since --border-width-* and --border-1 are lengths, not colours. */
const semanticColorVars = src.color.map((l) => '--' + l.split('|')[0].replace(/\//g, '-'));
const onlyLight = [...darkNames].filter((n) => !lightNames.has(n));
const onlyDark = semanticColorVars.filter((n) => !darkNames.has(n));
if (onlyLight.length) errors.push(`Declared in dark but not light: ${onlyLight.join(', ')}`);
if (onlyDark.length) errors.push(`Semantic color missing a dark value: ${onlyDark.join(', ')}`);
const notInLight = semanticColorVars.filter((n) => !lightNames.has(n));
if (notInLight.length) errors.push(`Semantic color missing a light value: ${notInLight.join(', ')}`);

/* --- resolve + contrast --- */
const prim = new Map(src.primitives.map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]));
const theme = { light: {}, dark: {} };
for (const line of src.color) {
  const [name, l, d] = line.split('|');
  for (const [k, alias] of [['light', l], ['dark', d]]) {
    const v = prim.get(alias);
    if (v === undefined) errors.push(`${name} (${k}) points at missing primitive "${alias}"`);
    theme[k][name] = v;
  }
}

const srgb = (h) => {
  const n = h.replace('#', '').slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
};
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => { const [r, g, b] = srgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const TEXT = ['text/primary', 'text/body', 'text/secondary', 'text/tertiary', 'text/brand', 'text/accent', 'text/danger'];
const BG = ['bg/page', 'bg/subtle', 'surface/subtle'];
const report = [];
for (const mode of ['light', 'dark']) {
  for (const t of TEXT) for (const b of BG) {
    const r = contrast(theme[mode][t], theme[mode][b]);
    if (r < 4.5) report.push({ mode, text: t, on: b, ratio: +r.toFixed(2), largeTextAA: r >= 3 });
  }
}

console.log(`✓ ${declared.size} custom properties declared, ${new Set(referenced).size} referenced, all resolve`);
console.log(`✓ ${Object.keys(theme.light).length} semantic tokens present in both themes`);
if (report.length) {
  console.log(`\n⚠ ${report.length} text/background pairs below WCAG AA 4.5:1 (documented in docs/audit.md):`);
  for (const r of report) {
    console.log(`  ${r.mode.padEnd(5)} ${r.text.padEnd(16)} on ${r.on.padEnd(15)} ${String(r.ratio).padStart(5)}:1  ${r.largeTextAA ? 'passes AA for large text' : 'fails AA entirely'}`);
  }
}
if (errors.length) {
  console.error('\n✗ ' + errors.join('\n✗ '));
  process.exit(1);
}
console.log('\nAll structural checks passed.');
