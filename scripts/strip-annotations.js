#!/usr/bin/env node
// strip-annotations.js
//
// Strips [EXTRACTED | ...] and [ELABORATED | ...] annotations from a draft
// pattern file. Creates a backup before overwriting.
//
// DEVELOPMENT USE ONLY — never run on a real draft you intend to publish.

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

// ---------------------------------------------------------------------------
// Warning + confirmation
// ---------------------------------------------------------------------------

function warn() {
  const border = '!'.repeat(72);
  console.error('');
  console.error(border);
  console.error('!!                                                                   !!');
  console.error('!!   ⚠️  DEVELOPMENT TOOL — DESTRUCTIVE OPERATION ⚠️                !!');
  console.error('!!                                                                   !!');
  console.error('!!   This script PERMANENTLY REMOVES all annotation markers from     !!');
  console.error('!!   the target file. FOR DEVELOPMENT / TESTING ONLY.               !!');
  console.error('!!                                                                   !!');
  console.error('!!   DO NOT run this on a real draft you intend to publish.          !!');
  console.error('!!   Annotations are provenance records — stripping them means       !!');
  console.error('!!   losing the audit trail for that draft permanently.              !!');
  console.error('!!   Use /publish to move a finished draft to production instead.    !!');
  console.error('!!                                                                   !!');
  console.error('!!   A backup (_backup.md) will be created before any changes.       !!');
  console.error('!!                                                                   !!');
  console.error(border);
  console.error('');
}

async function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

// ---------------------------------------------------------------------------
// Annotation stripping
// ---------------------------------------------------------------------------

// Matches [EXTRACTED | ...] or [ELABORATED | ...] wherever they appear,
// including inline within text. Uses [^\]]* to stop at the closing bracket.
const ANNOTATION_RE = /\[(EXTRACTED|ELABORATED)\s*\|[^\]]*\]/g;

function stripAnnotations(content) {
  // Remove annotation markers inline — works whether they are standalone
  // on a line or embedded within surrounding text.
  let result = content.replace(ANNOTATION_RE, '');

  // Lines that were solely an annotation (possibly with surrounding whitespace)
  // are now blank — trim trailing whitespace on each line first.
  result = result
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');

  // Collapse runs of more than one blank line down to a single blank line.
  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error('Usage: node scripts/strip-annotations.js <draft-file.md>');
  process.exit(2);
}

const targetPath = path.resolve(args[0]);

if (!fs.existsSync(targetPath)) {
  console.error(`File not found: ${args[0]}`);
  process.exit(2);
}

// Safety check: warn loudly if the path looks like a published pattern.
const relativePath = path.relative(process.cwd(), targetPath);
if (relativePath.startsWith('src/content/')) {
  console.error('');
  console.error('ERROR: Refusing to run on a file inside src/content/.');
  console.error('Published patterns must not be stripped with this tool.');
  console.error('');
  process.exit(1);
}

warn();

console.error(`Target file : ${relativePath}`);
console.error('');

const answer = await confirm('Type YES (all caps) to proceed: ');

if (answer !== 'yes') {
  console.error('Aborted. No changes made.');
  process.exit(0);
}

// Build backup path: <basename>_backup.md
const dir = path.dirname(targetPath);
const ext = path.extname(targetPath);
const base = path.basename(targetPath, ext);
const backupPath = path.join(dir, `${base}_backup${ext}`);

const original = fs.readFileSync(targetPath, 'utf-8');

// Write backup
fs.writeFileSync(backupPath, original, 'utf-8');
console.error(`\nBackup written to: ${path.relative(process.cwd(), backupPath)}`);

// Strip and count
const stripped = stripAnnotations(original);

const countOriginal = (original.match(/\[(EXTRACTED|ELABORATED)\s*\|/g) || []).length;
const countStripped = (stripped.match(/\[(EXTRACTED|ELABORATED)\s*\|/g) || []).length;
const removed = countOriginal - countStripped;

fs.writeFileSync(targetPath, stripped, 'utf-8');

console.error(`Annotations removed: ${removed}`);
if (countStripped > 0) {
  console.error(`WARNING: ${countStripped} annotation(s) could not be removed (multi-line or unusual format?)`);
}
console.error(`Done. ${relativePath} updated.`);
