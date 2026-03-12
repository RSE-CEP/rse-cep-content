# /publish — Publish a Draft Pattern

Validate a draft pattern and move it from `drafts/patterns/` to `src/content/patterns/` for publication.

## Arguments

Optionally specify a draft file path. If not provided, list files in `drafts/patterns/` and ask the operator which to publish.

## Publish Checks

All checks must pass before the file can be moved to production.

### 1. Schema Validation

Run the schema validator against the draft file:

```bash
node --import tsx scripts/validate.js drafts/patterns/{slug}.md
```

The file must pass all frontmatter schema checks.

### 2. Annotation Check

Run the annotation scanner to detect remaining draft markers:

```bash
node scripts/check-draft.js drafts/patterns/{slug}.md
```

**FAIL if ANY `[EXTRACTED |` or `[ELABORATED |` markers remain.** All annotations must be removed by a human reviewer before publishing. This ensures every claim has been verified against source material.

### 3. Section Completeness

Verify all 9 expected body sections are present (H2 headings):
- Intent
- Context
- Issues
- Solution
- Implementation Examples
- Context-Specific Guidance
- Consequences
- Known Uses
- Related Patterns

**FAIL if any section is missing.** This is a hard requirement for publication (unlike validation, which soft-warns).

### 4. Quality Review

Review the draft against the pattern quality criteria from `docs/patterns/1 - Pattern_Definition_Guide.md`. Flag obvious issues:
- Empty or placeholder sections
- Sections that are just a single sentence when they should be substantive
- Content that reads like a tutorial or step-by-step guide rather than a pattern
- Missing or clearly wrong frontmatter values

Report quality concerns but do not block publication for them — the operator decides.

## On All Checks Passing

1. **Move the file** from `drafts/patterns/{slug}.md` to `src/content/patterns/{slug}.md`
2. **Run validation again** against the new location to confirm:
   ```bash
   node --import tsx scripts/validate.js src/content/patterns/{slug}.md
   ```
3. **Report success** with a summary of what was published
4. **Offer to commit** — create a commit with the new pattern file. The operator decides.

## On Check Failure

- Report which checks failed with details
- If annotations remain: list them with line numbers and type
- If sections are missing: list which ones
- **Do NOT move the file**
- Suggest next steps (e.g., "remove remaining annotations", "add the missing sections")
