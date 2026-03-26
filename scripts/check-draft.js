import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Annotation detection for draft pattern files
//
// Scans a markdown file for [EXTRACTED | ...] and [ELABORATED | ...] markers.
// Exit code 0 = no annotations found (ready to publish)
// Exit code 1 = annotations remain (not ready)
// ---------------------------------------------------------------------------

const ANNOTATION_RE = /\[(EXTRACTED|ELABORATED)\s*\|/g;

// Lint: flag EXTRACTED annotations where basis looks like it contains a quote
// (longer than ~100 chars or contains quotation marks)
const EXTRACTED_BASIS_RE = /\[EXTRACTED\s*\|[\s\S]*?basis:\s*"([^"]*?)"\s*\]/g;

function checkFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${filePath}`);
    process.exit(2);
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  const lines = content.split('\n');
  const annotations = [];
  const warnings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let match;
    ANNOTATION_RE.lastIndex = 0;
    while ((match = ANNOTATION_RE.exec(line)) !== null) {
      annotations.push({
        line: i + 1,
        type: match[1],
        text: line.trim(),
      });
    }

    // Lint EXTRACTED basis fields for potential embedded quotes
    EXTRACTED_BASIS_RE.lastIndex = 0;
    let basisMatch;
    while ((basisMatch = EXTRACTED_BASIS_RE.exec(line)) !== null) {
      const basis = basisMatch[1];
      if (basis.length > 100) {
        warnings.push({
          line: i + 1,
          msg: `basis field is ${basis.length} chars (>100) — may contain embedded source text`,
        });
      }
      if (/['\u2018\u2019\u201C\u201D]/.test(basis)) {
        warnings.push({
          line: i + 1,
          msg: `basis field contains quotation marks — should be a summary, not a quote`,
        });
      }
    }
  }

  const relativePath = path.relative(process.cwd(), resolved);

  if (annotations.length === 0 && warnings.length === 0) {
    console.log(`✓ ${relativePath} — no annotations found (ready to publish)`);
    return 0;
  }

  if (annotations.length === 0 && warnings.length > 0) {
    console.log(`✓ ${relativePath} — no annotations found (ready to publish)`);
    // Still show warnings even if no annotations remain
    console.log(`  ⚠ ${warnings.length} lint warning(s):\n`);
    for (const w of warnings) {
      console.log(`  line ${w.line}: ${w.msg}`);
    }
    return 0;
  }

  const extracted = annotations.filter((a) => a.type === 'EXTRACTED').length;
  const elaborated = annotations.filter((a) => a.type === 'ELABORATED').length;

  console.log(
    `✗ ${relativePath} — ${annotations.length} annotation(s) remaining`
  );
  console.log(`  EXTRACTED: ${extracted}, ELABORATED: ${elaborated}\n`);

  for (const ann of annotations) {
    console.log(`  line ${ann.line} [${ann.type}]: ${ann.text}`);
  }

  if (warnings.length > 0) {
    console.log(`\n  ⚠ ${warnings.length} lint warning(s):\n`);
    for (const w of warnings) {
      console.log(`  line ${w.line}: ${w.msg}`);
    }
  }

  return 1;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node scripts/check-draft.js <file.md> [file2.md ...]');
  process.exit(2);
}

let exitCode = 0;
for (const arg of args) {
  const result = checkFile(arg);
  if (result > exitCode) exitCode = result;
}

process.exit(exitCode);
