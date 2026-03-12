import fs from 'node:fs';
import path from 'node:path';
import { glob } from 'node:fs/promises';
import matter from 'gray-matter';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Schema — mirrors src/content.config.ts (uses zod directly, not astro/zod)
// ---------------------------------------------------------------------------

const patternSchema = z.object({
  title: z.string(),
  pattern_id: z.string(),
  alternative_names: z.array(z.string()).optional(),
  keywords: z.array(z.string()).min(1),
  hass_domains: z.array(z.string()).min(1),
  version: z.string().optional(),
  author: z.string(),
  last_updated: z.coerce.date(),

  // Extraction-pipeline provenance (optional)
  source_type: z
    .enum([
      'interview-transcript',
      'talk-transcript',
      'manual-notes',
      'slides',
      'mixed',
    ])
    .optional(),
  source_ref: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

// ---------------------------------------------------------------------------
// Expected body sections (soft warnings)
// ---------------------------------------------------------------------------

const EXPECTED_SECTIONS = [
  'Intent',
  'Context',
  'Issues',
  'Solution',
  'Implementation Examples',
  'Context-Specific Guidance',
  'Consequences',
  'Known Uses',
  'Related Patterns',
];

/**
 * Extract H2 headings from markdown body.
 */
function extractH2Headings(body) {
  const headings = [];
  for (const line of body.split('\n')) {
    const match = line.match(/^##\s+(.+)/);
    if (match) {
      headings.push(match[1].trim());
    }
  }
  return headings;
}

// ---------------------------------------------------------------------------
// Collect files to validate
// ---------------------------------------------------------------------------

async function collectFiles(args) {
  if (args.length === 0) {
    // Default: all markdown in src/content/
    const files = [];
    for await (const entry of glob('src/content/**/*.md')) {
      files.push(entry);
    }
    return files.sort();
  }

  const files = [];
  for (const arg of args) {
    const resolved = path.resolve(arg);
    const stat = fs.statSync(resolved, { throwIfNoEntry: false });
    if (!stat) {
      console.error(`  Path not found: ${arg}`);
      continue;
    }
    if (stat.isDirectory()) {
      for await (const entry of glob(path.join(resolved, '**/*.md'))) {
        files.push(entry);
      }
    } else {
      files.push(resolved);
    }
  }
  return files.sort();
}

// ---------------------------------------------------------------------------
// Determine schema for a file based on its path
// ---------------------------------------------------------------------------

function schemaForFile(filePath) {
  if (
    filePath.includes(path.join('content', 'patterns')) ||
    filePath.includes(path.join('drafts', 'patterns'))
  ) {
    return { name: 'pattern', schema: patternSchema };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Validate a single file
// ---------------------------------------------------------------------------

function validateFile(filePath, { publishMode = false } = {}) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(process.cwd(), filePath);

  const errors = [];
  const warnings = [];

  // Parse frontmatter
  let parsed;
  try {
    parsed = matter(raw);
  } catch (err) {
    errors.push(`YAML parse error: ${err.message}`);
    return { file: relativePath, errors, warnings };
  }

  // Determine schema
  const info = schemaForFile(filePath);
  if (!info) {
    warnings.push('Could not determine content type from path — skipping schema validation');
    return { file: relativePath, errors, warnings };
  }

  // Validate frontmatter against Zod schema
  const result = info.schema.safeParse(parsed.data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const fieldPath = issue.path.join('.');
      errors.push(`field '${fieldPath}': ${issue.message}`);
    }
  }

  // Check missing body sections (soft-warn normally, hard-fail in --publish mode)
  if (info.name === 'pattern') {
    const headings = extractH2Headings(parsed.content);
    for (const section of EXPECTED_SECTIONS) {
      if (!headings.includes(section)) {
        if (publishMode) {
          errors.push(`Missing section (required for publish): ${section}`);
        } else {
          warnings.push(`Missing section: ${section}`);
        }
      }
    }
  }

  return { file: relativePath, errors, warnings };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const publishMode = process.argv.includes('--publish');
  const args = process.argv.slice(2).filter((a) => a !== '--publish');
  const files = await collectFiles(args);

  if (files.length === 0) {
    console.log('No content files found.');
    process.exit(0);
  }

  let passed = 0;
  let failed = 0;

  for (const filePath of files) {
    const { file, errors, warnings } = validateFile(filePath, { publishMode });
    const ok = errors.length === 0;

    if (ok) {
      passed++;
      console.log(`\u2713 ${file} \u2014 PASS`);
    } else {
      failed++;
      console.log(`\u2717 ${file} \u2014 FAIL`);
      for (const err of errors) {
        console.log(`  - ${err}`);
      }
    }

    for (const warn of warnings) {
      console.log(`  \u26A0 ${warn}`);
    }
  }

  console.log(`\nSummary: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
