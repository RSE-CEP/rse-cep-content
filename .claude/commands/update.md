# /update — Edit a Published Pattern

Interactively edit a published pattern in `src/content/patterns/`, with validation checks and index maintenance. The pattern remains published throughout — no return to draft status.

## Arguments

Specify one of:
- **File path:** `src/content/patterns/{slug}.md`
- **Pattern ID:** e.g. `I-001`, `A-004` — resolved via `drafts/pattern-index.md`

If neither is provided, list files in `src/content/patterns/` and ask the operator which to edit.

## Authoritative References

Before starting, read these files to understand the pattern structure and validation rules:

1. **`docs/patterns/2 - Pattern_Template.md`** — The canonical pattern template.
2. **`src/content.config.ts`** — The Zod schema defining frontmatter fields.
3. **`docs/pattern_typology_agents.md`** — Pattern type definitions and classification guidance.

## Flow

### 1. Load

1. **Resolve the pattern file.** If the operator provided a pattern ID, look it up in `drafts/pattern-index.md` to find the title and slug. The file is at `src/content/patterns/{slug}.md`.
2. **Read the pattern file** into context.
3. **Read the pattern index entry** from `drafts/pattern-index.md` for the current row data.
4. **Read the schema** from `src/content.config.ts` so you know the validation rules.

Report to the operator:

```
## Editing: {title} ({pattern_id})

File: src/content/patterns/{slug}.md
Type: {pattern_type}
Keywords: {keywords}
HASS Domains: {hass_domains}
```

Then ask: "What changes would you like to make?"

### 2. Interactive Editing

Apply changes as the operator directs. Edits are made in-place in `src/content/patterns/`.

**Two modes of change — annotation rules:**

#### Operator-directed edits — NO annotation
These are changes where the operator is the author:
- Fixing typos, grammar, or formatting
- Updating URLs, dates, or metadata fields
- Rewriting a sentence where the operator dictates the new wording
- Removing or rearranging content
- Changing frontmatter values (keywords, domains, etc.)

#### Model-generated substantive content — MUST annotate
These are changes where the model generates narrative content:
- Adding a new Known Use
- Expanding a section to cover a new topic
- Writing a new Implementation Example
- Adding new context or guidance

Use `[ELABORATED | basis: "..."]` annotations — the same syntax as `/draft`. Place the annotation immediately after the generated content.

**The rule: if you are generating narrative content that wasn't explicitly dictated by the operator, you must annotate. When in doubt, annotate.** A false positive (unnecessary annotation) costs the operator one line deletion. A false negative (unverified AI content in production) defeats the purpose of the annotation system.

After each round of edits, report what was changed and ask if there are more changes.

### 3. Exit Gate

When the operator signals they are done (e.g., "that's all", "done", "finish", "publish the changes"), run the exit gate checks:

#### 3a. Schema Validation

```bash
node --import tsx scripts/validate.js src/content/patterns/{slug}.md
```

The file must pass all frontmatter schema checks.

#### 3b. Section Completeness

Verify all 9 expected body sections are present (H2 headings):
- Intent
- Context
- Issues
- Motivating Example
- Solution
- Implementation Examples
- Consequences
- Known Uses
- References

#### 3c. Annotation Check

```bash
node scripts/check-draft.js src/content/patterns/{slug}.md
```

If annotations remain, report them with line numbers. The operator must review and remove each annotation before finishing — same workflow as `/publish`. Do not proceed past the exit gate while annotations remain.

#### 3d. Diff-Aware URL Verification

Compare the current file content against the version before editing began (use `git diff` or the content loaded in step 1). Identify URLs that are **new or changed** (not all URLs in the file).

For each new or changed URL:
1. **Fetch the URL** using WebFetch (or curl as fallback) to confirm it resolves.
2. **Verify the destination matches** what the link text claims.

Report results as a table. FAIL on hard errors (4xx, 5xx, connection failure). WARN on content mismatches (non-blocking).

If no URLs were added or changed, skip this check and report: "No new or changed URLs — skipping URL verification."

#### Exit Gate Result

If all checks pass, report success and proceed to index sync. If any check fails, report which checks failed with details and wait for the operator to fix the issues before re-running the gate.

### 4. Index Sync

Compare the current pattern state against the index entry loaded in step 1. Check for changes to:
- `title`
- `keywords`
- `hass_domains`
- `pattern_type`
- The pattern's essential nature (has the core intent or solution shifted significantly?)

If any of these changed:
1. Update the corresponding row in `drafts/pattern-index.md`.
2. If the pattern's nature has shifted meaningfully (not just a keyword tweak), rewrite the Summary column to reflect the new essence.
3. Report the index changes to the operator.

If nothing index-relevant changed, report: "No index-relevant changes — pattern index unchanged."

### 5. Git Integration

Before creating the feature branch, check the state of local master:

```bash
git fetch origin master && git rev-list --left-right --count origin/master...HEAD
```

Interpret the output:
- **Right > 0** (unpushed commits): Warn the operator.
- **Left > 0** (behind origin): Warn and offer to pull.
- **Both 0**: Proceed silently.

After the check (or operator confirmation), offer to:
1. Create a feature branch (`feature/update-{slug}`)
2. Commit all changed files (pattern file, updated index)
3. The operator decides — do not auto-commit without confirmation.

## What NOT To Do

- Do not move the pattern file out of `src/content/patterns/`. It stays published throughout.
- Do not run a quality review stage. The pattern already passed quality review at publication.
- Do not annotate operator-directed edits. Only annotate model-generated substantive content.
- Do not skip the exit gate. Always run all checks before finishing.
- Do not silently update the index. Always report changes to the operator.
- Do not use `[square brackets]` in the pattern body except for annotation syntax (`[EXTRACTED | ...]` and `[ELABORATED | ...]`).
- Do not invent Known Uses or Implementation Examples — these must be real.
