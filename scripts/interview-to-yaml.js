#!/usr/bin/env node
// Convert an AI interview JSON to a compact YAML file.
// Drops the dead `topic_index` field and adds a `turn` index to each entry.
// Usage: node scripts/interview-to-yaml.js _sources/foo_interview.json

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/interview-to-yaml.js <path-to-interview.json>');
  process.exit(1);
}

const abs = resolve(inputPath);
const data = JSON.parse(readFileSync(abs, 'utf8'));

// Minimal YAML serialiser — handles strings (with block scalars for multiline),
// arrays, plain scalars, and null. Sufficient for this schema.
function yamlValue(value, indent) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    if (value.includes('\n')) {
      const pad = ' '.repeat(indent + 2);
      return '|\n' + value.split('\n').map(l => pad + l).join('\n');
    }
    // Quote if contains characters that need it
    if (/[:#\[\]{}&*!|>'"%@`,]/.test(value) || value.trim() !== value || value === '') {
      return JSON.stringify(value);
    }
    return value;
  }
  return JSON.stringify(value); // fallback
}

function yamlObject(obj, indent) {
  const pad = ' '.repeat(indent);
  return Object.entries(obj)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        if (v.length === 0) return `${pad}${k}: []`;
        const items = v.map(item => {
          if (item !== null && typeof item === 'object') {
            const inner = yamlObject(item, indent + 4);
            // Indent the block under the dash
            const lines = inner.split('\n');
            return `${pad}  - ${lines[0].trimStart()}\n${lines.slice(1).join('\n')}`;
          }
          return `${pad}  - ${yamlValue(item, indent + 4)}`;
        }).join('\n');
        return `${pad}${k}:\n${items}`;
      }
      if (v !== null && typeof v === 'object') {
        return `${pad}${k}:\n${yamlObject(v, indent + 2)}`;
      }
      const rendered = yamlValue(v, indent);
      if (rendered.startsWith('|')) {
        return `${pad}${k}: ${rendered}`;
      }
      return `${pad}${k}: ${rendered}`;
    })
    .join('\n');
}

// Build output structure
const turns = (data.turns || []).map((turn, i) => {
  const { topic_index, ...rest } = turn;
  return { turn: i, ...rest };
});

const output = {
  session_id: data.session_id,
  start_time: data.start_time,
  end_time: data.end_time,
  turns,
};

const yaml = '---\n' + yamlObject(output, 0) + '\n';

const outPath = resolve(dirname(abs), basename(abs, extname(abs)) + '.yaml');
writeFileSync(outPath, yaml, 'utf8');
console.log(`Written: ${outPath}`);
