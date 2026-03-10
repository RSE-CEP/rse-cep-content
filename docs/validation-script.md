# Validation Script

The validation script (`scripts/validate.js`) checks that content files conform to their Zod schemas. It serves two purposes:

1. **CI gate** — runs in GitHub Actions on every PR to prevent invalid content from being merged
2. **Authoring feedback** — run locally during content creation (manually or invoked by the Claude extraction skill)

## Usage

```bash
# Validate all content files
npm run validate

# Validate a specific file
npm run validate -- src/content/patterns/ner-newspapers.md

# Validate a specific directory
npm run validate -- src/content/patterns/
```

## What It Checks

### Frontmatter Validation (hard fail)

Each content file's YAML frontmatter is parsed and validated against the Zod schema for its content type (determined by the `type` field). This catches:

- Missing required fields
- Wrong field types (e.g., string where number expected)
- Invalid enum values (e.g., `type: "article"` when only `pattern`, `roadmap-item`, `principle` are allowed)
- Format errors (e.g., invalid date format for `last_updated`)

Validation failures cause a non-zero exit code, which fails the CI check.

### Body Section Checks (soft warning)

The script optionally checks for expected H2 sections in the markdown body. For patterns, these are: Context, Problem, Solution, HASS Considerations, Examples. Missing sections produce warnings but do not fail validation.

## Output Format

The script produces structured output:

```
✓ src/content/patterns/ner-newspapers.md — PASS
✗ src/content/patterns/broken-example.md — FAIL
  - field 'maturity': Invalid enum value. Expected 'draft' | 'reviewed' | 'published', received 'wip'
  - field 'hass_domains': Required
  ⚠ Missing section: Examples

Summary: 1 passed, 1 failed
```

## How It Works

1. Accepts a file path or globs across `src/content/`
2. Reads each markdown file and parses YAML frontmatter using `gray-matter`
3. Looks up the `type` field to determine which Zod schema to use
4. Imports the schema from `src/content/config.ts` (via `tsx` for TypeScript support)
5. Runs `zodSchema.safeParse()` against the parsed frontmatter
6. Optionally scans the markdown body for expected H2 headings
7. Outputs results and exits with code 0 (all pass) or 1 (any fail)

## Dependencies

- **`gray-matter`** — YAML frontmatter parser
- **`zod`** — already an Astro dependency, used for schema definitions
- **`tsx`** — allows importing TypeScript config from the validation script

These are listed as `devDependencies` in `package.json`.

## Relationship to Astro's Built-in Validation

Astro's content collections also validate against Zod schemas at build time. The validation script is **not redundant** — it serves a different purpose:

- **Astro build validation** catches errors during `astro build`, but the error messages are mixed in with other build output and harder to parse for specific field-level feedback.
- **The validation script** gives fast, targeted feedback on frontmatter errors without running a full build. It's designed for the authoring workflow (quick iteration) and CI (clear pass/fail).

Both run in CI: the validation script first (fast, specific feedback), then the trial build (catches everything else).
