# /extract — AI-Assisted Pattern Extraction

Extract structured pattern content from a source document in `_sources/` and produce a validated draft markdown file.

## Arguments

The operator should specify:
- Which source document(s) to extract from (path in `_sources/`)
- Optional focus guidance (e.g., "focus on NER patterns", "extract the data management aspects")
- Optional `pattern_id` and `author` (will be prompted if not provided)

## Authoritative References

Before starting, read these files to understand the expected output format:

1. **`docs/patterns/2 - Pattern_Template.md`** — The canonical pattern template. Your output must follow this structure.
2. **`src/content.config.ts`** — The Zod schema defining required and optional frontmatter fields.
3. **`tools/prompt-templates/pattern.md`** — Quick reference for frontmatter fields, body sections, and provenance conventions.
4. **`docs/patterns/1 - Pattern_Definition_Guide.md`** — What patterns are, quality criteria, how they differ from best practices/principles/tutorials.

For a worked example, see: `src/content/patterns/version-control-for-research.md`

## Key Principles

- **Extraction before elaboration.** Always distinguish what comes from the source document versus what you generate to fill gaps.
- **Patterns are not prescriptive recipes.** They describe issues and solutions, providing guidance and principles rather than step-by-step instructions.
- **"Issues" not "Problems".** Use the project's inclusive terminology — issues may be requirements, principles, goals, challenges, or technical problems.
- **Source sensitivity.** Never include file paths, Sharepoint URLs, or identifying details about research participants in the output. Use `source_ref` for human-readable provenance only.
- **Schema is law.** The Zod schema in `src/content.config.ts` determines what passes validation. Your output must conform to it.

## Extraction Flow

Operate in four stages. Report your progress to the operator at each stage.

### Stage 1 — Source Classification

Read the source document(s) provided by the operator. Characterise the input:

| Source Type | Characteristics | Extraction Strategy |
|---|---|---|
| `interview-transcript` | Structured by questions, rich contextual detail | Extract directly from answers, use questions for section mapping |
| `talk-transcript` | Narrative flow, may reference slides | Restructure narrative into template sections |
| `manual-notes` | Sparse, telegraphic | More elaboration needed, flag gaps prominently |
| `slides` | Fragmentary claims, bullet points | Significant elaboration needed, low confidence |
| `mixed` | Combination of the above | Adapt per-section |

Report the classification to the operator before proceeding.

### Stage 2 — Template-Aware Extraction

Extract content from the source into the pattern template structure. For each section:

1. **Map source content to template sections.** Find passages in the source that correspond to Intent, Context, Issues, Solution, etc.
2. **Extract faithfully.** Use the source's own language and ideas. Restructure for clarity but do not invent content.
3. **Track provenance.** For each section, note whether it was:
   - **EXTRACTED** — Content directly from the source
   - **THIN** — Some relevant content exists but insufficient for a complete section
   - **ABSENT** — No relevant content in the source for this section

Present the extraction results to the operator as a structured report before proceeding:

```
## Extraction Report

### Frontmatter
- title: [proposed] — [source/elaborated]
- pattern_id: [proposed] — [needs operator input]
...

### Body Sections
| Section | Status | Source Location |
|---|---|---|
| Intent | EXTRACTED | Q2 response, paragraphs 3-4 |
| Context | EXTRACTED | Q1 and Q5 responses |
| Issues | THIN | Mentioned in Q3 but not elaborated |
...
```

### Stage 3 — Guided Elaboration

For sections marked THIN or ABSENT, propose content to fill the gaps. Clearly mark all elaborated content.

Present elaboration proposals to the operator. Wait for the operator to accept, reject, or modify each proposal before proceeding. If the operator instructs you to proceed without review, combine accepted defaults and continue.

### Stage 4 — Output and Validation

1. **Compose the final markdown file.** Combine frontmatter and body sections.

2. **Use structured annotations.** All content must use the annotation syntax:
   - Extracted content: `[EXTRACTED | source: "description" | ref: location | "key quote"]`
   - Elaborated content: `[ELABORATED | basis: "reason for elaboration"]`

   These annotations are visible inline for reviewer verification and machine-parseable for the publish workflow.

3. **Determine the output path.** Use kebab-case slug: `drafts/patterns/{slug}.md`

4. **Write the file** to the drafts directory.

5. **Run validation:**
   ```bash
   node --import tsx scripts/validate.js drafts/patterns/{slug}.md
   ```

6. **If validation fails:** Read the error output, fix the issues, re-validate. Repeat until validation passes.

7. **Report final status:**
   ```
   ## Extraction Complete

   - **File:** drafts/patterns/{slug}.md
   - **Validation:** PASS
   - **Confidence:** 0.X (proportion extracted vs elaborated)
   - **Sections extracted:** N of 9 essential sections
   - **Sections elaborated:** N sections
   - **Annotations:** N [EXTRACTED], N [ELABORATED] markers for reviewer verification
   - **Operator review needed:** [list any areas needing attention]
   ```

### Git Integration

After successful extraction, offer to:
1. Create a feature branch (`feature/pattern-{slug}`)
2. Commit the draft file
3. The operator decides — do not auto-commit without confirmation.

## Multiple Patterns

If the source document contains material for multiple patterns, identify them in Stage 1 and ask the operator which to extract first. Process one pattern at a time.

## What NOT To Do

- Do not commit source documents or include source file paths in output.
- Do not silently fill gaps — always use annotation syntax to flag elaborated content.
- Do not include identifying details about research participants.
- Do not skip validation — always run `scripts/validate.js` after writing.
- Do not invent Known Uses or Implementation Examples — these must be real.
- Do not add a maturity level field — maturity judgements are out of scope.
