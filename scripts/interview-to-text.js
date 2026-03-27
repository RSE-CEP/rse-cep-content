#!/usr/bin/env node
// Convert an AI interview chatbot export to a plain-text rendition.
// The output is a stable, line-numbered text file suitable for both LLM reading
// and ptr: annotations in the drafting pipeline.
//
// Accepts JSON (chatbot native export) or YAML (legacy converted files).
//
// Usage: node scripts/interview-to-text.js _sources/foo_interview.json
//        node scripts/interview-to-text.js _sources/foo_interview.yaml
//
// Output: _sources/foo_interview.txt (same directory, .txt extension)
//
// Going forward, the operator flow is: chatbot JSON → this script → .txt
// The former interview-to-yaml.js intermediate step is no longer needed.

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';
import jsYaml from 'js-yaml';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/interview-to-text.js <path-to-interview.json|yaml>');
  process.exit(1);
}

const abs = resolve(inputPath);
const ext = extname(abs).toLowerCase();

let data;
if (ext === '.json') {
  data = JSON.parse(readFileSync(abs, 'utf8'));
} else if (ext === '.yaml' || ext === '.yml') {
  data = jsYaml.load(readFileSync(abs, 'utf8'));
} else {
  console.error(`Unsupported file type: ${ext} (expected .json, .yaml, or .yml)`);
  process.exit(1);
}

if (!Array.isArray(data.turns) || data.turns.length === 0) {
  console.error('Error: file does not contain a "turns" array (not an interview transcript?)');
  process.exit(1);
}

// Build header
const stem = basename(abs, ext);
const lines = [];
lines.push(`=== Interview: ${stem} ===`);
if (data.session_id) lines.push(`Session: ${data.session_id}`);
if (data.start_time) {
  const dateStr = String(data.start_time).slice(0, 10);
  lines.push(`Date: ${dateStr}`);
}
lines.push('');

// Build turns
for (let i = 0; i < data.turns.length; i++) {
  const turn = data.turns[i];
  const num = turn.turn_number ?? turn.turn ?? i + 1;
  const speaker = turn.speaker || 'unknown';
  lines.push(`--- Turn ${num} [${speaker}] ---`);

  const content = (turn.content || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  // Collapse runs of 3+ blank lines to 2 (preserve paragraph breaks)
  const cleaned = content.replace(/\n{3,}/g, '\n\n');
  lines.push(cleaned);
  lines.push('');
}

const output = lines.join('\n');
const outPath = resolve(dirname(abs), stem + '.txt');
writeFileSync(outPath, output, 'utf8');

const lineCount = output.split('\n').length;
console.log(`Written: ${outPath} (${lineCount} lines)`);
