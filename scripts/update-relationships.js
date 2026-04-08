#!/usr/bin/env node

/**
 * update-relationships.js — Validate and merge relationship/alignment data.
 *
 * Two modes:
 *   node scripts/update-relationships.js relate --input '{"A-004": [...]}'
 *   node scripts/update-relationships.js align  --input '{"A-004": [...]}'
 *
 * Deterministic — no LLM access. Validates payloads with Zod, merges into
 * the shared JSON data files, writes back atomically.
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import yaml from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, 'src/data');
const PATTERNS_DIR = resolve(ROOT, 'src/content/patterns');

// --- Helpers ---

function loadJSON(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return {};
  }
}

function writeJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function getPublishedPatternIds() {
  const files = readdirSync(PATTERNS_DIR).filter((f) => f.endsWith('.md'));
  const ids = [];
  for (const file of files) {
    const content = readFileSync(resolve(PATTERNS_DIR, file), 'utf-8');
    const match = content.match(/^pattern_id:\s*["']?([IADP]-\d{3})["']?\s*$/m);
    if (match) ids.push(match[1]);
  }
  return ids;
}

function getPrincipleIds() {
  const raw = readFileSync(resolve(DATA_DIR, 'principles.yml'), 'utf-8');
  const doc = yaml.load(raw);
  return (doc.principles || []).map((p) => p.id);
}

// --- Zod Schemas ---

const RELATIONSHIP_TYPES = [
  'works-well-with',
  'alternative-approach',
  'typical-sequence-before',
  'typical-sequence-after',
];

const relationshipEntrySchema = z.object({
  related_id: z.string().regex(/^[IADP]-\d{3}$/),
  relationship: z.enum(RELATIONSHIP_TYPES),
  rationale: z.string().min(1),
});

const relatePayloadSchema = z.record(
  z.string().regex(/^[IADP]-\d{3}$/),
  z.array(relationshipEntrySchema),
);

const alignmentEntrySchema = z.object({
  principle_id: z.string().min(1),
  relevance: z.string().min(1),
});

const alignPayloadSchema = z.record(
  z.string().regex(/^[IADP]-\d{3}$/),
  z.array(alignmentEntrySchema),
);

// --- Mode: relate ---

function runRelate(inputJSON) {
  // Parse payload
  let payload;
  try {
    payload = JSON.parse(inputJSON);
  } catch (e) {
    console.error('ERROR: Invalid JSON input');
    process.exit(1);
  }

  // Validate shape
  const result = relatePayloadSchema.safeParse(payload);
  if (!result.success) {
    console.error('ERROR: Payload validation failed');
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  // Validate referenced pattern IDs exist
  const publishedIds = getPublishedPatternIds();
  const allReferencedIds = new Set();
  for (const [patternId, entries] of Object.entries(payload)) {
    allReferencedIds.add(patternId);
    for (const entry of entries) {
      allReferencedIds.add(entry.related_id);
    }
  }
  const missing = [...allReferencedIds].filter((id) => !publishedIds.includes(id));
  if (missing.length > 0) {
    console.error(`ERROR: Referenced pattern IDs not found in published patterns: ${missing.join(', ')}`);
    process.exit(1);
  }

  // Load existing and merge
  const filePath = resolve(DATA_DIR, 'related-patterns.json');
  const existing = loadJSON(filePath);

  let added = 0;
  let skipped = 0;

  for (const [patternId, entries] of Object.entries(payload)) {
    if (!existing[patternId]) {
      existing[patternId] = [];
    }
    for (const entry of entries) {
      const alreadyExists = existing[patternId].some(
        (e) => e.related_id === entry.related_id,
      );
      if (alreadyExists) {
        skipped++;
      } else {
        existing[patternId].push(entry);
        added++;
      }
    }
  }

  writeJSON(filePath, existing);
  console.log(`OK: relate — ${added} added, ${skipped} skipped (duplicate). File: ${filePath}`);
}

// --- Mode: align ---

function runAlign(inputJSON) {
  // Parse payload
  let payload;
  try {
    payload = JSON.parse(inputJSON);
  } catch (e) {
    console.error('ERROR: Invalid JSON input');
    process.exit(1);
  }

  // Validate shape
  const result = alignPayloadSchema.safeParse(payload);
  if (!result.success) {
    console.error('ERROR: Payload validation failed');
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  // Validate principle IDs exist
  const validPrincipleIds = getPrincipleIds();
  const invalidPrinciples = [];
  for (const [, entries] of Object.entries(payload)) {
    for (const entry of entries) {
      if (!validPrincipleIds.includes(entry.principle_id)) {
        invalidPrinciples.push(entry.principle_id);
      }
    }
  }
  if (invalidPrinciples.length > 0) {
    console.error(`ERROR: Invalid principle IDs: ${[...new Set(invalidPrinciples)].join(', ')}`);
    console.error(`  Valid IDs: ${validPrincipleIds.join(', ')}`);
    process.exit(1);
  }

  // Load existing and merge (replace by principle_id per pattern)
  const filePath = resolve(DATA_DIR, 'principle-alignments.json');
  const existing = loadJSON(filePath);

  let replaced = 0;
  let added = 0;

  for (const [patternId, entries] of Object.entries(payload)) {
    if (!existing[patternId]) {
      existing[patternId] = [];
    }
    for (const entry of entries) {
      const idx = existing[patternId].findIndex(
        (e) => e.principle_id === entry.principle_id,
      );
      if (idx >= 0) {
        existing[patternId][idx] = entry;
        replaced++;
      } else {
        existing[patternId].push(entry);
        added++;
      }
    }
  }

  writeJSON(filePath, existing);
  console.log(`OK: align — ${added} added, ${replaced} replaced. File: ${filePath}`);
}

// --- CLI ---

const [, , mode, flag, inputArg] = process.argv;

if (!mode || !['relate', 'align'].includes(mode)) {
  console.error('Usage: node scripts/update-relationships.js <relate|align> --input \'<json>\'');
  process.exit(1);
}

if (flag !== '--input' || !inputArg) {
  console.error('Usage: node scripts/update-relationships.js <relate|align> --input \'<json>\'');
  process.exit(1);
}

if (mode === 'relate') {
  runRelate(inputArg);
} else {
  runAlign(inputArg);
}
