#!/usr/bin/env node
/**
 * Generates every distributable artifact from build/source.json,
 * which is itself exported from Figma. Nothing here is hand-written:
 * change the Figma variables, re-export, re-run `npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = JSON.parse(readFileSync(join(root, 'build/source.json'), 'utf8'));

/* ---------- helpers ---------- */
const kebab = (n) => n.replace(/\//g, '-');
const isColor = (v) => typeof v === 'string' && v.startsWith('#');
const isNum = (v) => v !== '' && !Number.isNaN(Number(v));

const primitives = new Map();
for (const line of src.primitives) {
  const i = line.indexOf('=');
  primitives.set(line.slice(0, i), line.slice(i + 1));
}

const pairs = (arr) => arr.map((l) => l.split('|'));
const colorTokens = pairs(src.color);       // [name, lightAlias, darkAlias]
const spacingTokens = pairs(src.spacing);   // [name, primitiveAlias]
const typeTokens = pairs(src.typography);   // [name, primitiveAlias]

const resolve = (alias) => {
  const v = primitives.get(alias);
  if (v === undefined) throw new Error(`Unresolved primitive alias: ${alias}`);
  return v;
};

/* Figma stores weights and families as editor-facing names; CSS needs real values. */
const CSS_OVERRIDE = {
  'font-weight/regular': '400',
  'font-weight/medium': '500',
  'font-weight/semibold': '600',
  'font-family/inter': "'Inter', system-ui, -apple-system, sans-serif",
  'font-family/ibm-plex-mono': "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace",
};
/** Numeric weight for JS consumers, keyed by the Figma style name. */
const WEIGHT_NUMERIC = { Regular: 400, Medium: 500, 'Semi Bold': 600 };

const asCss = (name, raw) => {
  if (CSS_OVERRIDE[name]) return CSS_OVERRIDE[name];
  if (isColor(raw)) return raw;
  if (!isNum(raw)) return raw;
  if (name.startsWith('radius/full')) return '9999px';
  if (Number(raw) === 0) return '0';
  return `${raw}px`;
};

/* ---------- 1. W3C DTCG token files ---------- */
const dtcgGroup = (entries, type, valueFn) => {
  const out = {};
  for (const [name, ...rest] of entries) {
    const path = name.split('/');
    let node = out;
    for (const seg of path.slice(0, -1)) node = node[seg] ??= {};
    node[path.at(-1)] = { $type: type, $value: valueFn(...rest), $extensions: { 'com.figma': { name } } };
  }
  return out;
};

mkdirSync(join(root, 'tokens'), { recursive: true });

const primitiveEntries = [...primitives].map(([n, v]) => [n, v]);
const primColors = primitiveEntries.filter(([, v]) => isColor(v));
const primNumbers = primitiveEntries.filter(([n, v]) => isNum(v) && !isColor(v));
const primStrings = primitiveEntries.filter(([, v]) => !isColor(v) && !isNum(v));

writeFileSync(
  join(root, 'tokens/primitives.json'),
  JSON.stringify(
    {
      $description: 'Raw values. Not for direct use — consume the semantic layers instead.',
      ...dtcgGroup(primColors, 'color', (v) => v),
      ...dtcgGroup(primNumbers, 'dimension', (v) => (Number(v) === 0 ? '0' : `${v}px`)),
      ...dtcgGroup(primStrings, 'fontFamily', (v) => v),
    },
    null,
    2
  ) + '\n'
);

/* DTCG requires a single $value per token, so themes ship as parallel token sets
   over the same shared primitives — the standard multi-theme layout. */
for (const [theme, idx] of [['light', 0], ['dark', 1]]) {
  writeFileSync(
    join(root, `tokens/color.${theme}.json`),
    JSON.stringify(
      {
        $description: `Semantic color — ${theme} theme. Compose with tokens/primitives.json.`,
        ...dtcgGroup(colorTokens, 'color', (...aliases) => `{${aliases[idx].replace(/\//g, '.')}}`),
      },
      null,
      2
    ) + '\n'
  );
}

writeFileSync(
  join(root, 'tokens/spacing.json'),
  JSON.stringify(
    {
      $description: 'Spacing scale, radii, border widths and control/icon sizing.',
      ...dtcgGroup(spacingTokens, 'dimension', (a) => `{${a.replace(/\//g, '.')}}`),
    },
    null,
    2
  ) + '\n'
);

writeFileSync(
  join(root, 'tokens/typography.json'),
  JSON.stringify(
    {
      $description: 'Type families, weights, sizes, line heights and letter spacing.',
      ...dtcgGroup(typeTokens, 'dimension', (a) => `{${a.replace(/\//g, '.')}}`),
    },
    null,
    2
  ) + '\n'
);

writeFileSync(
  join(root, 'tokens/effects.json'),
  JSON.stringify(
    {
      $description: 'Elevation and glow shadows.',
      shadow: Object.fromEntries(src.shadows.map((s) => [s.name, { $type: 'shadow', $value: s.value }])),
    },
    null,
    2
  ) + '\n'
);

/* ---------- 2. CSS custom properties ---------- */
const seen = new Set();
const decl = (name, value) => {
  const prop = `--${kebab(name)}`;
  if (seen.has(prop)) return null; // primitive radius/full and semantic radius/full collide by design
  seen.add(prop);
  return `  ${prop}: ${value};`;
};

const lines = [];
lines.push('/* Generated by build/build.mjs — do not edit by hand. */');
lines.push('');
lines.push(':root {');
lines.push('  /* --- primitives --- */');
for (const [n, v] of primitiveEntries) {
  const d = decl(n, asCss(n, v));
  if (d) lines.push(d);
}
lines.push('');
lines.push('  /* --- spacing, radius, sizing --- */');
for (const [n, a] of spacingTokens) {
  const d = decl(n, `var(--${kebab(a)})`);
  if (d) lines.push(d);
}
lines.push('');
lines.push('  /* --- typography --- */');
for (const [n, a] of typeTokens) {
  const d = decl(n, `var(--${kebab(a)})`);
  if (d) lines.push(d);
}
lines.push('');
lines.push('  /* --- elevation --- */');
for (const s of src.shadows) lines.push(`  --shadow-${s.name}: ${s.value};`);
lines.push('');
lines.push('  /* --- semantic color (light) --- */');
for (const [n, light] of colorTokens) lines.push(`  --${kebab(n)}: var(--${kebab(light)});`);
lines.push('}');
lines.push('');

const darkBlock = colorTokens.map(([n, , dark]) => `  --${kebab(n)}: var(--${kebab(dark)});`).join('\n');
lines.push('/* Opt-in dark theme */');
lines.push(`[data-theme='dark'] {\n${darkBlock}\n}`);
lines.push('');
lines.push('/* Follow the OS unless an explicit theme is set */');
lines.push(`@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n${darkBlock}\n  }\n}`);
lines.push('');

/* type style utility classes */
lines.push('/* --- type styles --- */');
for (const t of src.textStyles) {
  const rules = [
    `font-family: var(--font-family-${t.family});`,
    `font-weight: var(--font-weight-${t.weight});`,
    `font-size: var(--font-size-${t.size});`,
    t.lineHeight ? `line-height: var(--font-line-height-${t.lineHeight});` : 'line-height: 1.2;',
    `letter-spacing: var(--font-letter-spacing-${t.letterSpacing});`,
    t.textCase === 'uppercase' ? 'text-transform: uppercase;' : null,
  ].filter(Boolean);
  lines.push(`.type-${t.css} {\n${rules.map((r) => '  ' + r).join('\n')}\n}`);
}
lines.push('');

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/tokens.css'), lines.join('\n'));

/* ---------- 3. TypeScript constants ---------- */
const camel = (s) => s.replace(/[-/](.)/g, (_, c) => c.toUpperCase());
const tsObj = (entries) =>
  '{\n' + entries.map(([k, v]) => `  '${k}': ${JSON.stringify(v)},`).join('\n') + '\n} as const';

const ts = `// Generated by build/build.mjs — do not edit by hand.

/** Raw palette. Prefer the semantic tokens below. */
export const primitives = ${tsObj(primitiveEntries)};

/** Semantic colors, resolved per theme. */
export const color = {
  light: ${tsObj(colorTokens.map(([n, l]) => [n, resolve(l)]))},
  dark: ${tsObj(colorTokens.map(([n, , d]) => [n, resolve(d)]))},
} as const;

/** CSS custom property name for a semantic color token. */
export const colorVar = (token: ColorToken) => \`var(--\${token.replace(/\\//g, '-')})\`;

export const spacing = ${tsObj(spacingTokens.map(([n, a]) => [n, Number(resolve(a))]))};

export const typography = ${tsObj(
  typeTokens.map(([n, a]) => {
    const raw = resolve(a);
    if (n.startsWith('font/weight/')) return [n, WEIGHT_NUMERIC[raw] ?? raw];
    return [n, isNum(raw) ? Number(raw) : raw];
  })
)};

export const shadow = ${tsObj(src.shadows.map((s) => [s.name, s.value]))};

export type ColorToken = keyof typeof color.light;
export type SpacingToken = keyof typeof spacing;
export type TypographyToken = keyof typeof typography;
export type ShadowToken = keyof typeof shadow;
`;
writeFileSync(join(root, 'dist/tokens.ts'), ts);

/* ---------- 4. Tailwind preset ---------- */
const nest = (entries, strip, transform) => {
  const out = {};
  for (const [name, ...rest] of entries) {
    if (!name.startsWith(strip)) continue;
    const key = name.slice(strip.length) || 'DEFAULT';
    out[key.replace(/\//g, '-')] = transform(...rest);
  }
  return out;
};
const cssVar = (n) => `var(--${kebab(n)})`;

const twColors = {};
for (const [name] of colorTokens) {
  const [group, ...rest] = name.split('/');
  const key = rest.join('-') || 'DEFAULT';
  (twColors[group] ??= {})[key] = cssVar(name);
}

const preset = {
  theme: {
    extend: {
      colors: twColors,
      spacing: nest(spacingTokens, 'spacing/', () => null) && Object.fromEntries(
        spacingTokens.filter(([n]) => n.startsWith('spacing/')).map(([n]) => [n.slice('spacing/'.length).replace(/\//g, '-'), cssVar(n)])
      ),
      borderRadius: Object.fromEntries(
        spacingTokens.filter(([n]) => n.startsWith('radius/')).map(([n]) => [n.slice('radius/'.length), cssVar(n)])
      ),
      borderWidth: Object.fromEntries(
        spacingTokens.filter(([n]) => n.startsWith('border-width/')).map(([n]) => [n.slice('border-width/'.length), cssVar(n)])
      ),
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: Object.fromEntries(
        typeTokens.filter(([n]) => n.startsWith('font/size/')).map(([n]) => [n.slice('font/size/'.length), cssVar(n)])
      ),
      lineHeight: Object.fromEntries(
        typeTokens.filter(([n]) => n.startsWith('font/line-height/')).map(([n]) => [n.slice('font/line-height/'.length), cssVar(n)])
      ),
      letterSpacing: Object.fromEntries(
        typeTokens.filter(([n]) => n.startsWith('font/letter-spacing/')).map(([n]) => [n.slice('font/letter-spacing/'.length), cssVar(n)])
      ),
      boxShadow: Object.fromEntries(src.shadows.map((s) => [s.name, `var(--shadow-${s.name})`])),
    },
  },
};

writeFileSync(
  join(root, 'dist/tailwind.preset.js'),
  '// Generated by build/build.mjs — do not edit by hand.\n' +
    '// Colors resolve through CSS variables, so dark mode works by toggling [data-theme].\n' +
    'export default ' +
    JSON.stringify(preset, null, 2) +
    ';\n'
);

console.log(
  `built: ${primitives.size} primitives, ${colorTokens.length} color, ${spacingTokens.length} spacing, ${typeTokens.length} typography, ${src.shadows.length} shadows, ${src.textStyles.length} type styles`
);
