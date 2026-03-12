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

function checkFile(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    console.error(`File not found: ${filePath}`);
    process.exit(2);
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  const lines = content.split('\n');
  const annotations = [];

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
  }

  const relativePath = path.relative(process.cwd(), resolved);

  if (annotations.length === 0) {
    console.log(`✓ ${relativePath} — no annotations found (ready to publish)`);
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
