/**
 * next-pattern-id.js — Output the next available pattern ID for a given type.
 *
 * Scans both the proto-pattern index (drafts/protopatterns/index.md) and the
 * published pattern index (drafts/pattern-index.md) to find the highest
 * assigned ID per type prefix, then prints the next one.
 *
 * Usage:
 *   node scripts/next-pattern-id.js <type>
 *
 * Where <type> is one of: I, A, D, P
 *
 * Output: the next available ID, e.g. "I-005"
 */

import fs from 'node:fs';
import path from 'node:path';

const VALID_TYPES = ['I', 'A', 'D', 'P'];

const INDEX_FILES = [
  '_local/protopatterns/index.md',
  'drafts/pattern-index.md',
];

/**
 * Parse a markdown table and extract all pattern IDs from the ID column.
 * Returns an array of ID strings like ["I-001", "A-002"].
 */
function extractIdsFromMarkdownTable(content) {
  const ids = [];
  for (const line of content.split('\n')) {
    // Skip non-table lines, header row, and separator row
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;
    const id = cells[0];
    // Match pattern ID format: {I|A|D|P}-NNN
    if (/^[IADP]-\d{3}$/.test(id)) {
      ids.push(id);
    }
  }
  return ids;
}

/**
 * Get the next available ID for a given type prefix.
 */
function getNextId(typePrefix) {
  const allIds = [];

  for (const relPath of INDEX_FILES) {
    const absPath = path.resolve(relPath);
    if (!fs.existsSync(absPath)) continue;
    const content = fs.readFileSync(absPath, 'utf-8');
    allIds.push(...extractIdsFromMarkdownTable(content));
  }

  // Filter to the requested type and find the max sequence number
  const typeIds = allIds
    .filter(id => id.startsWith(typePrefix + '-'))
    .map(id => parseInt(id.split('-')[1], 10));

  const maxSeq = typeIds.length > 0 ? Math.max(...typeIds) : 0;
  const nextSeq = String(maxSeq + 1).padStart(3, '0');

  return `${typePrefix}-${nextSeq}`;
}

// --- Main ---

const typeArg = process.argv[2]?.toUpperCase();

if (!typeArg || !VALID_TYPES.includes(typeArg)) {
  console.error(`Usage: node scripts/next-pattern-id.js <type>`);
  console.error(`  type: one of ${VALID_TYPES.join(', ')}`);
  process.exit(1);
}

console.log(getNextId(typeArg));
